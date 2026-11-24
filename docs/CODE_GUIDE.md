# ExpiryAlert Code Guide

This guide explains what each file does, why it exists and how it connects to the others.

## Following one request from start to finish

Here is what happens when a user adds a product:

1. `pages/AddProduct.jsx` shows `components/ProductForm.jsx`.
2. `ProductForm` stores what is typed using `useState`, then checks the values when the form is submitted.
3. It calls the `onSubmit` prop, which runs `createProduct()` from `services/api.js`.
4. Axios sends `POST http://localhost:5000/api/products` with the data as JSON.
5. In `server.js`, `cors()` allows the request and `express.json()` fills `req.body`.
6. `requireDatabase` confirms that MongoDB is connected.
7. `routes/productRoutes.js` passes the request to `createProduct` in `controllers/productController.js`.
8. The controller validates the data, then `Product.create()` saves it through `models/Product.js`.
9. The controller adds `daysLeft` and `status` with `withExpiryInfo()` and sends status 201.
10. React receives the response and `useNavigate` opens the new product's details page.

## Backend

### `server.js`
The entry point. It creates the Express app, registers middleware and routes, connects to MongoDB, then starts listening on port 5000.

**Middleware order matters.** `cors` and `express.json` must run before the routes. `notFound` and `errorHandler` come last so they only run when nothing earlier responded.

### `config/db.js`
Connects Mongoose to MongoDB using `MONGODB_URI` from `.env`. If MongoDB is not running, it gives up after 5 seconds and the server stops with a clear message.

### `.env` and `.env.example`
`.env` holds settings that should not be written into the code, and Git ignores it. `.env.example` is a safe copy showing which settings are needed.

### `models/Product.js`
Defines the Mongoose schema: each field's type and validation rules. `timestamps: true` adds `createdAt` and `updatedAt` automatically. The model named `Product` is stored in the `products` collection.

### `utils/expiry.js`
Holds every expiry rule in one place.

| Function | What it does |
|---|---|
| `getToday()` | Gets today's date on Nepal's calendar |
| `parseDateOnly()` | Converts `YYYY-MM-DD` to a Date, rejecting impossible dates like 31 February |
| `getDaysLeft()` | Counts the days between today and the expiry date |
| `getExpiryStatus()` | Turns days left into Expired, Expiring Soon or Safe |
| `getStatusCondition()` | Turns a status into a date range for a MongoDB query |
| `withExpiryInfo()` | Adds `daysLeft` and `status` to a product before it is sent |

**Why dates are stored at midnight UTC:** MongoDB saves a full moment in time, not just a calendar date. Using midnight UTC for every expiry date means subtracting two dates always gives a whole number of days.

### `controllers/productController.js`
The application logic for products.

- `validateProduct()` checks the request body and returns clean data with a list of errors.
- `buildFilter()` turns URL query parameters into a Mongoose filter.
- `escapeRegex()` makes symbols in a search behave as plain text.
- `createProduct`, `getProducts`, `getProductById`, `updateProduct` and `deleteProduct` are the CRUD functions.

`expressAsyncHandler` passes any error from an `async` function to the error handler, so each function does not need its own `try...catch`.

### `controllers/dashboardController.js`
Calculates the statistics with `countDocuments()` and fetches the dashboard lists. `Promise.all` runs the four counts at the same time.

### `routes/productRoutes.js` and `routes/dashboardRoutes.js`
These only connect URLs and HTTP methods to controller functions. Routes decide where a request goes, and controllers decide what happens.

### `middleware/errorMiddleware.js`
- `requireDatabase` immediately returns 503 if MongoDB is disconnected.
- `notFound` returns 404 for unknown routes.
- `errorHandler` turns errors into clean JSON. For example, a `CastError` from an invalid ID becomes a 400 response.

### `scripts/seed.js`
Adds sample products for demonstrations. It only ever deletes records whose description starts with `[TEST DATA]`.

### `tests/expiry.test.js`
Unit tests for the expiry rules, using Node's built-in test runner. Run them with `npm test`.

## Frontend

### `main.jsx`
The React entry point. It displays `App` inside the `root` div of `index.html`, wrapped in `BrowserRouter` so routing works everywhere.

### `App.jsx`
Connects each URL to a page with `Routes`. The landing page stands alone, while every other page is nested inside `AppLayout`, which adds the sidebar and navbar.

| URL | Page |
|---|---|
| `/` | Landing |
| `/dashboard` | Dashboard |
| `/products` | Products |
| `/products/new` | AddProduct |
| `/products/:id` | ProductDetails |
| `/products/:id/edit` | EditProduct |
| `/about` | About |
| anything else | NotFound |

### `services/api.js`
Every backend request lives here. Components call simple functions like `getProducts()` and never need to know the server's address. `getErrorMessage()` picks the best message to show the user.

### `utils/product.js`
Holds the category and status lists and the date formatting functions. Expiry dates are displayed in UTC because they are stored in UTC. Otherwise, a browser in a timezone behind UTC could show the previous day.

### `utils/shelfItems.js`
The eight example products on the landing page shelf, stored as SVG drawing data. They are not real products and never reach the database.

### Pages

| File | What it does |
|---|---|
| `Landing.jsx` | The home page, with its own styles in `Landing.css`; its button opens the dashboard |
| `Dashboard.jsx` | Loads the statistics and lists together using `Promise.all` |
| `Products.jsx` | Handles search, filters, sorting and deleting from the table |
| `AddProduct.jsx` | Shows `ProductForm` and creates a product on submit |
| `EditProduct.jsx` | Loads the product, then shows `ProductForm` filled with its values |
| `ProductDetails.jsx` | Shows one product, with edit and delete options |
| `About.jsx` | Explains the application and the expiry rules |
| `NotFound.jsx` | Shown for unknown URLs |

### Components

| File | What it does |
|---|---|
| `AppLayout.jsx` | The sidebar and navbar around every page except the landing page; its `menuOpen` state controls the slide-in sidebar on small screens |
| `PantryShelf.jsx` | The animated shelf on the landing page; a timer or the slider moves the date, and each label is recalculated with the same rule as the backend |
| `Sidebar.jsx` | Main navigation; `NavLink` highlights the current page |
| `Navbar.jsx` | Shows the page title, today's date and the mobile menu button |
| `StatCard.jsx` | One dashboard number, linking to the filtered list |
| `StatusBadge.jsx` | The coloured Expired, Expiring Soon or Safe label |
| `ProductTable.jsx` | The products table, which becomes cards on phones |
| `ProductSection.jsx` | One titled list on the dashboard |
| `ProductForm.jsx` | The form shared by Add and Edit, with validation |
| `ConfirmDialog.jsx` | The delete confirmation popup |
| `Feedback.jsx` | Shared `Loading`, `ErrorMessage` and `EmptyState` components |

### `App.css` and `index.css`
`index.css` holds the colours, base styles and CSS variables. `App.css` holds the styles for the layout and components, including the responsive rules at the bottom.

## React concepts used

| Concept | Example |
|---|---|
| Components | `StatCard`, `ProductTable` |
| Props | `ProductTable` receives `products` and `onDelete` |
| `useState` | Form values, loaded data and error messages |
| `useEffect` | Loading data when a page opens |
| Forms and events | `handleChange` and `handleSubmit` in `ProductForm` |
| Conditional rendering | Showing a loader, an error, an empty state or the table |
| Lists and keys | `products.map()` with `key={product._id}` |
| React Router | `Routes`, `Link`, `NavLink`, `useNavigate`, `useParams`, `useSearchParams` |
| Axios | All requests in `services/api.js` |

## Two patterns worth being able to explain

**The `ignore` flag in `useEffect`:** data arrives after a delay. If the user has already left the page, the cleanup function sets `ignore` to `true`, so the late response is not used.

**Waiting before searching:** `Products.jsx` waits 250 milliseconds after a change before calling the API. This avoids sending one request for every letter typed.

## Files added beyond the suggested structure

| Addition | Reason |
|---|---|
| `backend/utils/expiry.js` | Keeps the expiry rules in one place, shared by every feature |
| `backend/middleware/errorMiddleware.js` | Handles errors in one place |
| `backend/scripts/seed.js`, `backend/tests/` | Demonstration data and unit tests |
| `GET /api/dashboard/recent` | Needed for the Recently Added section |
| Separate Add and Edit pages | Simpler than a modal, and each page has its own URL |
| Extra components | Avoids repeating the same interface code on several pages |
