import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addDays,
  getDaysLeft,
  getExpiryStatus,
  getStatusCondition,
  getToday,
  parseDateOnly,
} from "../utils/expiry.js";

const today = new Date("2026-11-01T00:00:00.000Z");
const statusIn = (days) =>
  getExpiryStatus(getDaysLeft(addDays(today, days), today));

test("status follows the assignment's expiry rules", () => {
  assert.equal(statusIn(-1), "Expired");
  assert.equal(statusIn(0), "Expiring Soon");
  assert.equal(statusIn(3), "Expiring Soon");
  assert.equal(statusIn(7), "Expiring Soon");
  assert.equal(statusIn(8), "Safe");
  assert.equal(statusIn(10), "Safe");
});

test("today uses Nepal's calendar, which is UTC+5:45", () => {
  // 18:14 UTC is 23:59 in Nepal, still 1 November.
  assert.equal(
    getToday(new Date("2026-11-01T18:14:00.000Z")).toISOString(),
    "2026-11-01T00:00:00.000Z",
  );
  // 18:15 UTC is 00:00 in Nepal, already 2 November.
  assert.equal(
    getToday(new Date("2026-11-01T18:15:00.000Z")).toISOString(),
    "2026-11-02T00:00:00.000Z",
  );
});

test("date parsing accepts real dates and rejects everything else", () => {
  assert.equal(
    parseDateOnly("2028-02-29").toISOString(),
    "2028-02-29T00:00:00.000Z",
  );
  for (const bad of ["2026-02-31", "2026-13-01", "01/11/2026", "", null, 5]) {
    assert.equal(parseDateOnly(bad), null);
  }
});

test("status filters do not overlap at the 7 day boundary", () => {
  const soon = getStatusCondition("Expiring Soon", today).expiryDate;
  const safe = getStatusCondition("Safe", today).expiryDate;
  assert.equal(soon.$lte.getTime(), safe.$gt.getTime());
  assert.equal(
    getStatusCondition("Expired", today).expiryDate.$lt.getTime(),
    soon.$gte.getTime(),
  );
});
