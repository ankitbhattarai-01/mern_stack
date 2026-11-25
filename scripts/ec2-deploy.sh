#!/usr/bin/env bash
# Installs the newest tested build from the "deploy" branch, and puts the
# previous version back if the health check fails. Run by mern-deploy.timer.
set -euo pipefail
REPO="${REPO:-https://github.com/ankitbhattarai-01/mern_stack.git}"
BASE="${BASE:-$HOME/deploy}"
APP="${APP:-$HOME/mern_stack/backend}"
WEB="${WEB:-/var/www/expiryalert}"
HEALTH="${HEALTH:-http://127.0.0.1/api/dashboard/stats}"
RESTART="${RESTART:-pm2 restart backend}"
TRIES="${TRIES:-15}"

mkdir -p "$BASE"
exec 9>"$BASE/lock"
flock -n 9 || exit 0

sha="$(git ls-remote "$REPO" refs/heads/deploy | cut -f1)"
[ -n "$sha" ] || exit 0
[ "$sha" != "$(cat "$BASE/current" 2>/dev/null || true)" ] || exit 0
[ "$sha" != "$(cat "$BASE/failed" 2>/dev/null || true)" ] || exit 0

echo "Deploying build $sha"
stage="$BASE/stage"; prev="$BASE/previous"
rm -rf "$stage"
trap 'rm -rf "$stage"' EXIT
git clone -q --depth 1 --branch deploy "$REPO" "$stage"
[ "$(git -C "$stage" rev-parse HEAD)" = "$sha" ] || { echo "Build changed while downloading; retrying next time"; exit 0; }
fail() { echo "$1" >&2; echo "$sha" > "$BASE/failed"; exit 1; }
[ -f "$stage/backend/server.js" ] && [ -f "$stage/frontend/index.html" ] || fail "Build is incomplete"
(cd "$stage/backend" && npm ci --omit=dev --no-audit --no-fund </dev/null) || fail "npm ci failed; the live app was not touched"
cp -p "$APP/.env" "$stage/backend/.env"

healthy() {
  for _ in $(seq 1 "$TRIES"); do
    curl -fsS -m 5 "$HEALTH" >/dev/null 2>&1 && return 0
    sleep 2
  done
  return 1
}
web_sync() { # new asset files first, then index.html, then remove old files
  mkdir -p "$2"
  cp -r "$1/." "$2/"
  (cd "$2" && find . -type f) | while IFS= read -r f; do [ -e "$1/$f" ] || rm -f "$2/$f"; done
  find "$2" -type d -exec chmod 755 {} +
  find "$2" -type f -exec chmod 644 {} +
}

rm -rf "$prev"
mkdir -p "$prev/frontend"
cp -r "$WEB/." "$prev/frontend/"
mv "$APP" "$prev/backend"
mv "$stage/backend" "$APP"
web_sync "$stage/frontend" "$WEB"
$RESTART >/dev/null </dev/null || true

if healthy; then
  echo "$sha" > "$BASE/current"
  rm -f "$BASE/failed"
  echo "Deployed and healthy: source $(cat "$stage/REVISION" 2>/dev/null || echo unknown)"
else
  echo "Health check failed; restoring the previous version" >&2
  rm -rf "$APP"
  mv "$prev/backend" "$APP"
  web_sync "$prev/frontend" "$WEB"
  $RESTART >/dev/null </dev/null || true
  echo "$sha" > "$BASE/failed"
  if healthy; then echo "Previous version restored" >&2; else echo "Previous version is not healthy either" >&2; fi
  exit 1
fi
