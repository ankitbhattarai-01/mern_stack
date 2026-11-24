# ExpiryAlert Presentation Notes

## What is ExpiryAlert?

ExpiryAlert is a web application that helps people keep track of product expiry dates. You add a product with its category, quantity and expiry date, and the application tells you whether it is expired, expiring soon or safe. The dashboard shows the whole picture in one place.

## Why did I choose this project?

Most of us have found something at the back of a fridge or medicine box that expired months ago. It wastes money, and with food or medicine it can be unsafe. I wanted to solve a simple, everyday problem. It was also a good fit for this assignment because managing products naturally uses all the CRUD operations.

## What is the MERN Stack?

MERN is four JavaScript technologies that work together:

- **MongoDB** is the database where products are stored.
- **Express.js** is the backend framework I used to build the API.
- **React** is the library I used to build the user interface.
- **Node.js** runs JavaScript on the server.

The main advantage is that I could use JavaScript for the whole project.

## How does the application work?

The project has three parts. React runs in the browser, Express runs on the server, and MongoDB stores the data.

When someone adds a product, React collects the form data and sends it to Express. Express checks that the data is valid, and Mongoose saves it to MongoDB. Express then sends back a response, and React updates the screen.

## How does React communicate with Express?

They communicate over HTTP using JSON, and I used Axios for the requests. All of my API calls are in one file, `services/api.js`. For example, `getProducts()` sends a GET request to `/api/products`.

The frontend runs on port 5173 and the backend on port 5000. Browsers normally block requests between different origins, so I used the `cors` middleware to allow my frontend.

## What are MongoDB and Mongoose?

MongoDB is a NoSQL database. It stores data as flexible, JSON-like documents instead of tables and rows. My `expiryAlert` database has a `products` collection, and each product is one document.

Mongoose is a library that connects Node.js to MongoDB. I used it to define a schema, which sets the rules for each field. For example, the name is required, the category must be one from my list, and the quantity can't be negative.

## What are CRUD operations?

CRUD stands for Create, Read, Update and Delete, the four basic things you can do with data.

| Operation | In ExpiryAlert | HTTP method |
|---|---|---|
| Create | Add a product | POST |
| Read | View the products and dashboard | GET |
| Update | Edit a product | PUT |
| Delete | Remove a product | DELETE |

## How does expiry status calculation work?

I compare the expiry date with today's date and count the days left.

- Less than 0 days left means **Expired**.
- 0 to 7 days left means **Expiring Soon**.
- More than 7 days left means **Safe**.

The important decision was not to save the status in the database. A product that is safe today won't be safe forever, so a saved status would eventually be wrong. Instead, it is calculated every time it is needed, so it is always up to date.

Filtering works the same way. When someone filters by Expired, the backend searches for expiry dates before today.

## What challenges did I face?

**Dates and timezones.** Nepal is UTC+5:45, and a JavaScript date can easily shift to the wrong day. A date saved as 5 November could appear as 4 November in another timezone. I solved this by storing every expiry date as midnight UTC, displaying it in UTC, and always working out "today" from Nepal's calendar.

**Keeping the numbers consistent.** The table, filters and dashboard all depend on expiry status. If each one had its own logic, they could disagree. I put all the rules into one file, `utils/expiry.js`, so everything uses the same calculation.

**The search box losing letters.** At first I stored the search text in the URL. The URL updates slightly after each keystroke, so fast typing could lose letters. Moving the search text into normal `useState` fixed it. This taught me that browser testing can find problems that API testing can't.

**Making the app work on mobile.** A table with six columns doesn't fit on a phone, so I used CSS to display each row as a card on small screens.

## What did I learn?

- How the frontend, backend and database connect in a full-stack application.
- How to build and test a REST API with proper status codes and error messages.
- How to use React state, effects, props and routing in a real project.
- Why validation is needed on both the frontend and the backend.
- Why it is better to calculate changing values than to store them.
- How important it is to test the error cases as well as the normal path.

## Suggested demonstration order

1. Show the dashboard and explain the four statistics.
2. Add a product that expires in a few days.
3. Show the new document in MongoDB Compass.
4. Edit the product and show the status change.
5. Use search, the category and status filters, and the sort option.
6. Delete a product, showing the confirmation, then return to the dashboard to show the updated numbers.
7. Submit an empty form to show validation.
8. Refresh the browser to show that the data is stored permanently.

## Questions your teacher might ask

**Why not store the status in the database?**
It changes as days pass, so a stored value would go out of date. Calculating it keeps it accurate.

**What is the difference between a route and a controller?**
A route connects a URL and HTTP method to a function. The controller is that function, and it contains the logic.

**Why validate on both the frontend and the backend?**
Frontend validation gives the user quick feedback. Backend validation protects the data, because requests can be sent without using my form.

**What does `useEffect` do in your project?**
It loads data from the API when a page opens, and again when filters change.

**Why use a `.env` file?**
It keeps configuration such as the database connection string out of the code and out of Git.

**What is an ObjectId?**
It is the unique ID MongoDB automatically gives each document. I use it in URLs such as `/products/:id`.

**What happens if MongoDB stops while the app is running?**
The API returns a 503 status, and the frontend shows an error with a Try again button. When MongoDB comes back, the server reconnects by itself.
