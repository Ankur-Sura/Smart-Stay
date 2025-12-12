/**
 * ===================================================================================
 *                    🏨 SMART STAY - Main Express Server (app.js)
 * ===================================================================================
 * 
 * 📖 NEW TO THIS PROJECT? START HERE!
 * ------------------------------------
 * Read the files in this order: docs/READING_ORDER.md
 * It will guide you through the codebase from basics to advanced AI features.
 * 
 * 📚 WHAT IS THIS FILE?
 * ---------------------
 * This is the MAIN SERVER FILE for Smart Stay - a hotel booking platform with AI features.
 * It's built using Express.js (Node.js web framework).
 * 
 * 🔗 HOW IT CONNECTS TO AI:
 * -------------------------
 * 
 *     User (Browser)
 *           ↓
 *     Express Server (app.js - port 8080)  ← THIS FILE!
 *           ↓
 *     AI Routes (routes/ai.js)
 *           ↓
 *     FastAPI Python Service (port 8000)
 *           ↓
 *     LangGraph Workflows (AI/travel_graph.py, AI/solo_trip_graph.py)
 * 
 * 📌 FOR YOUR INTERVIEW:
 * ----------------------
 * "I built Smart Stay using a microservices architecture. The main Express server
 * handles hotel CRUD operations and serves the frontend. For AI features like
 * Travel Planning and Smart Chat, it proxies requests to a FastAPI Python service
 * that runs LangGraph workflows."
 * 
 * ===================================================================================
 *                           ARCHITECTURE OVERVIEW
 * ===================================================================================
 * 
 * LAYER 1: Frontend (EJS Templates)
 *     - views/listings/* → Hotel listing pages
 *     - views/ai/*       → AI feature pages (Travel Planner, Solo Planner, Hotel Finder)
 * 
 * LAYER 2: Express Routes
 *     - GET/POST /listings/* → Hotel CRUD operations (this file)
 *     - POST /api/*          → AI features (routes/ai.js)
 * 
 * LAYER 3: Database
 *     - MongoDB (Mongoose ODM)
 *     - Collection: listings (hotels)
 * 
 * LAYER 4: AI Service
 *     - FastAPI (Python) running on port 8000
 *     - LangGraph workflows for travel planning
 * 
 * ===================================================================================
 */

// =============================================================================
//                           IMPORTS SECTION
// =============================================================================

const express = require("express");
/**
 * 📖 What is Express?
 * -------------------
 * Express is a minimal, flexible Node.js web application framework.
 * It provides a robust set of features for web applications.
 * 
 * Think of it as the "Django" or "Flask" of Node.js world.
 * 
 * 🔗 Express Docs: https://expressjs.com/
 */

const app = express();
/**
 * 📖 What is app?
 * ---------------
 * This creates an Express application instance.
 * All routes and middleware are attached to this app object.
 * 
 * 📌 Pattern:
 *     const app = express();
 *     app.get('/route', handler);
 *     app.listen(port);
 */

const mongoose = require("mongoose");
/**
 * 📖 What is Mongoose?
 * --------------------
 * Mongoose is an ODM (Object Document Mapper) for MongoDB.
 * 
 * It provides:
 *   - Schema definitions (structure for your data)
 *   - Model creation (classes for your collections)
 *   - Validation (ensure data integrity)
 *   - Query building (easier than raw MongoDB)
 * 
 * 🔗 Mongoose Docs: https://mongoosejs.com/
 * 
 * 📌 Why use Mongoose instead of raw MongoDB driver?
 *     - Type safety with schemas
 *     - Built-in validation
 *     - Middleware hooks (pre-save, post-save)
 *     - Cleaner syntax for queries
 */

const Listing = require("./models/listing.js");
/**
 * 📖 What is this Listing model?
 * ------------------------------
 * This imports our Hotel/Listing model (defined in models/listing.js).
 * 
 * It's a Mongoose model that represents hotel listings in our database.
 * Each listing has: title, description, image, price, location, country, amenities
 * 
 * 📌 Usage:
 *     const hotel = new Listing({ title: "Beach Resort" });
 *     await hotel.save();
 *     
 *     const all = await Listing.find({});
 */

const path = require("path");
/**
 * 📖 What is path?
 * ----------------
 * Built-in Node.js module for handling file paths.
 * 
 * 📌 Why use path.join() instead of string concatenation?
 *     - Works across operating systems (Windows vs Mac vs Linux)
 *     - Handles trailing slashes correctly
 *     - Example: path.join(__dirname, "views") → "/Users/.../Smart Stay/views"
 */

const methodOverride = require("method-override");
/**
 * 📖 What is method-override?
 * ---------------------------
 * HTML forms only support GET and POST methods.
 * But RESTful APIs need PUT, PATCH, DELETE too!
 * 
 * method-override lets us "fake" these methods using a query parameter.
 * 
 * 📌 Example:
 *     <form action="/listings/<%= listing._id %>?_method=DELETE" method="POST">
 *         <button>Delete</button>
 *     </form>
 * 
 * The POST request becomes a DELETE request because of ?_method=DELETE
 * 
 * 📌 FOR YOUR INTERVIEW:
 * "I use method-override to support PUT and DELETE HTTP methods from HTML forms,
 * since forms only support GET and POST natively."
 */

const ejsMate = require("ejs-mate");
/**
 * 📖 What is ejs-mate?
 * --------------------
 * ejs-mate is a layout engine for EJS (Embedded JavaScript templates).
 * 
 * It provides:
 *   - Layouts (like boilerplate.ejs that wraps all pages)
 *   - Blocks (for injecting content into specific areas)
 *   - Partials (reusable components like navbar, footer)
 * 
 * 📌 Example:
 *     In views/layouts/boilerplate.ejs:
 *         <html>
 *             <%- body %>  ← Page content goes here
 *         </html>
 *     
 *     In views/listings/index.ejs:
 *         <% layout("layouts/boilerplate") %>
 *         <h1>All Hotels</h1>  ← This becomes the "body"
 */


// =============================================================================
//                           CONFIGURATION
// =============================================================================

const MONGO_URL = "mongodb://127.0.0.1:27017/smartstay";
/**
 * 📖 MongoDB Connection String
 * ----------------------------
 * Format: mongodb://[host]:[port]/[database_name]
 * 
 * - 127.0.0.1 = localhost (local machine)
 * - 27017 = default MongoDB port
 * - smartstay = our database name (created automatically if doesn't exist)
 * 
 * 📌 FOR PRODUCTION:
 * Use environment variables:
 *     const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/smartstay";
 */

// Set EJS-Mate as the templating engine
app.engine("ejs", ejsMate);
/**
 * 📖 What does app.engine() do?
 * -----------------------------
 * Registers a template engine for a specific file extension.
 * 
 * Here we're saying: "When you see .ejs files, use ejs-mate to render them"
 * This enables layouts and partials in our EJS templates.
 */


// =============================================================================
//                           DATABASE CONNECTION
// =============================================================================

/**
 * 📖 Connecting to MongoDB
 * ------------------------
 * We use an async function because mongoose.connect() returns a Promise.
 * 
 * Pattern:
 *   1. Define async function
 *   2. Call mongoose.connect() with await
 *   3. Call the function and handle success/error with .then()/.catch()
 * 
 * 📌 WHY ASYNC/AWAIT?
 * Database operations are I/O bound (waiting for network).
 * We don't want to block the entire server while waiting.
 * Async/await lets us write non-blocking code that looks synchronous.
 */
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


// =============================================================================
//                           MIDDLEWARE SETUP
// =============================================================================

/**
 * 📖 What is Middleware?
 * ----------------------
 * Middleware functions have access to:
 *   - req (request object)
 *   - res (response object)  
 *   - next (function to call next middleware)
 * 
 * They run BEFORE your route handlers.
 * 
 * 📌 Order matters! Middleware runs in the order you define it.
 * 
 * 📌 Common middleware purposes:
 *   - Parse request body (express.json, express.urlencoded)
 *   - Serve static files (express.static)
 *   - Authentication
 *   - Logging
 *   - Error handling
 */

app.set("view engine", "ejs");
/**
 * Tell Express to use EJS for rendering views.
 * When you call res.render("index"), Express looks for index.ejs
 */

app.set("views", path.join(__dirname, "views"));
/**
 * Tell Express where to find view templates.
 * __dirname = current directory (Smart Stay folder)
 * path.join(__dirname, "views") = Smart Stay/views
 */

app.use(express.urlencoded({ extended: true }));
/**
 * 📖 What is express.urlencoded()?
 * --------------------------------
 * Parses URL-encoded form data (like from HTML forms).
 * 
 * When a form submits:
 *     <form action="/listings" method="POST">
 *         <input name="listing[title]" value="Beach Hotel">
 *     </form>
 * 
 * This middleware parses it into:
 *     req.body = { listing: { title: "Beach Hotel" } }
 * 
 * extended: true = allows nested objects (like listing[title])
 */

app.use(express.json());
/**
 * 📖 What is express.json()?
 * --------------------------
 * Parses JSON request bodies.
 * 
 * When the AI frontend sends:
 *     fetch('/api/travel/plan', {
 *         body: JSON.stringify({ query: "Plan trip to Goa" })
 *     })
 * 
 * This middleware parses it into:
 *     req.body = { query: "Plan trip to Goa" }
 * 
 * 📌 IMPORTANT: Without this, req.body would be undefined for JSON requests!
 */

app.use(methodOverride("_method"));
/**
 * Enables PUT/DELETE methods via ?_method=PUT or ?_method=DELETE
 * See explanation above in imports section.
 */

app.use(express.static(path.join(__dirname, "public")));
/**
 * 📖 What is express.static()?
 * ----------------------------
 * Serves static files (CSS, JS, images) from a directory.
 * 
 * With this, requests to /css/style.css serve public/css/style.css
 * No need to create routes for each static file!
 * 
 * 📌 Directory structure:
 *     public/
 *         css/
 *             style.css    → accessible at /css/style.css
 *         js/
 *             script.js    → accessible at /js/script.js
 */

app.locals.currUser = null;
/**
 * 📖 What is app.locals?
 * ----------------------
 * Variables set on app.locals are available in ALL views.
 * 
 * currUser = null means no user is logged in (for now).
 * This would be used if you add authentication later.
 * 
 * In views, you can access it directly:
 *     <% if (currUser) { %>
 *         <p>Welcome, <%= currUser.name %></p>
 *     <% } %>
 */


// =============================================================================
//                           AI ROUTES INTEGRATION
// =============================================================================

/**
 * 📖 AI Routes Module
 * -------------------
 * The AI routes are in a separate file (routes/ai.js) for clean code organization.
 * 
 * These routes handle:
 *   - POST /api/travel/plan        → Travel itinerary generation
 *   - POST /api/travel/solo/start  → Solo trip planner (starts HITL)
 *   - POST /api/travel/solo/resume → Solo trip planner (resumes after user answers)
 *   - POST /api/chat/smart         → Smart chat with auto tool detection
 *   - GET  /api/hotels/search      → AI-powered hotel search
 * 
 * 📌 FOR YOUR INTERVIEW:
 * "I organized AI routes in a separate module. This follows the Single Responsibility
 * Principle - main app.js handles core server setup, while routes/ai.js handles
 * AI-specific logic and communication with the FastAPI service."
 */
const aiRoutes = require("./routes/ai.js");
app.use("/api", aiRoutes);
/**
 * 📖 What is app.use() with a path prefix?
 * ----------------------------------------
 * app.use("/api", aiRoutes) means:
 *   - All routes in aiRoutes are prefixed with /api
 *   - If aiRoutes has router.post("/travel/plan"), it becomes POST /api/travel/plan
 * 
 * This is cleaner than writing /api/... in every route definition.
 */


// =============================================================================
//                           VIEW ROUTES (Pages)
// =============================================================================

/**
 * 📖 Route Pattern: GET routes for pages, POST/PUT/DELETE for actions
 * -------------------------------------------------------------------
 * 
 * RESTful Routes for Listings:
 * 
 * | HTTP Verb | Path               | Action  | Description                |
 * |-----------|--------------------| --------|----------------------------|
 * | GET       | /listings          | index   | Show all listings          |
 * | GET       | /listings/new      | new     | Show form to create new    |
 * | POST      | /listings          | create  | Create new listing         |
 * | GET       | /listings/:id      | show    | Show one listing           |
 * | GET       | /listings/:id/edit | edit    | Show form to edit          |
 * | PUT       | /listings/:id      | update  | Update one listing         |
 * | DELETE    | /listings/:id      | destroy | Delete one listing         |
 * 
 * 📌 This is the RESTful convention. Learn it well for interviews!
 */

// Root route - redirect to listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});
/**
 * When user visits http://localhost:8080/, redirect them to /listings.
 * This is common pattern - redirect root to main content page.
 */

// AI Feature Pages
app.get("/ai", (req, res) => {
  res.render("ai/index.ejs");
});
/**
 * 📖 AI Dashboard Page
 * --------------------
 * Shows all AI features available:
 *   - Travel Planner (8-node LangGraph)
 *   - Solo Planner (11-node with HITL)
 *   - Hotel Finder (MongoDB + AI search)
 */

// Combined Travel Planner + Smart Chat
app.get("/ai/travel-chat", (req, res) => {
  res.render("ai/travel-chat.ejs");
});
/**
 * 📖 Travel Chat Page
 * -------------------
 * This is the main travel planning interface.
 * Users can chat naturally and get complete travel itineraries.
 * 
 * Behind the scenes, it calls:
 *   POST /api/travel/plan → routes/ai.js → FastAPI → LangGraph workflow
 */

// Keep old routes for backward compatibility
app.get("/ai/travel-planner", (req, res) => {
  res.redirect("/ai/travel-chat");
});

app.get("/ai/smart-chat", (req, res) => {
  res.redirect("/ai/travel-chat");
});
/**
 * 📖 Backward Compatibility
 * -------------------------
 * Old URLs still work by redirecting to the new combined page.
 * This is good practice when changing URL structure.
 */

app.get("/ai/hotel-finder", (req, res) => {
  res.render("ai/hotel-finder.ejs");
});
/**
 * 📖 Hotel Finder Page
 * --------------------
 * AI-powered search through our MongoDB hotel database.
 * Users can search with natural language: "budget hotel in Goa with pool"
 */

app.get("/ai/solo-planner", (req, res) => {
  res.render("ai/solo-planner.ejs");
});
/**
 * 📖 Solo Trip Planner Page
 * -------------------------
 * Interactive trip planner with Human-in-the-Loop.
 * 
 * Flow:
 *   1. User enters trip request
 *   2. AI asks personalization questions
 *   3. User answers
 *   4. AI generates personalized itinerary
 * 
 * This uses 11-node LangGraph workflow with interrupt_before for HITL.
 */


// =============================================================================
//                           HOTEL LISTING CRUD ROUTES
// =============================================================================

/**
 * 📖 CRUD Operations
 * ------------------
 * CRUD = Create, Read, Update, Delete
 * 
 * These are the fundamental database operations.
 * Almost every web app needs CRUD for at least one resource.
 * 
 * 📌 FOR YOUR INTERVIEW:
 * "Smart Stay implements full CRUD operations for hotel listings using MongoDB
 * and Mongoose. The routes follow RESTful conventions with async/await for
 * database operations."
 */

// INDEX ROUTE - Show all listings
app.get("/listings", async (req, res) => {
  /**
   * 📖 Index Route
   * --------------
   * Purpose: Display all hotel listings
   * 
   * Flow:
   *   1. Fetch all listings from MongoDB
   *   2. Pass them to the view template
   *   3. Template renders each listing as a card
   * 
   * Mongoose Query:
   *   Listing.find({}) → Returns all documents in the collection
   *   {} means "no filter" → match everything
   */
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// NEW ROUTE - Show form to create new listing
app.get("/listings/new", (req, res) => {
  /**
   * 📖 New Route
   * ------------
   * Purpose: Show HTML form for creating new listing
   * 
   * Note: This is NOT async because it doesn't query the database.
   * It just renders a static form.
   * 
   * 📌 IMPORTANT: This route MUST come BEFORE /listings/:id
   * Why? Express matches routes in order. If :id came first,
   * "new" would be treated as an ID!
   */
  res.render("listings/new.ejs");
});

// SHOW ROUTE - Show one listing
app.get("/listings/:id", async (req, res) => {
  /**
   * 📖 Show Route
   * -------------
   * Purpose: Display details of a single listing
   * 
   * :id is a route parameter. Express extracts it from the URL.
   * Example: /listings/abc123 → req.params.id = "abc123"
   * 
   * Mongoose Query:
   *   Listing.findById(id) → Find one document by its _id field
   * 
   * 📌 In the view, access properties like:
   *     <%= listing.title %>
   *     <%= listing.price %>
   */
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// CREATE ROUTE - Create new listing
app.post("/listings", async (req, res) => {
  /**
   * 📖 Create Route
   * ---------------
   * Purpose: Save new listing to database
   * 
   * Flow:
   *   1. Form submits with listing data in req.body.listing
   *   2. Create new Listing document
   *   3. Save to MongoDB
   *   4. Redirect to listings index
   * 
   * 📌 Why try/catch?
   * Database operations can fail (validation errors, connection issues).
   * We catch errors and send meaningful response instead of crashing.
   */
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    res.status(400).send(`Unable to create listing: ${err.message}`);
  }
});

// EDIT ROUTE - Show form to edit listing
app.get("/listings/:id/edit", async (req, res) => {
  /**
   * 📖 Edit Route
   * -------------
   * Purpose: Show form pre-filled with existing listing data
   * 
   * Flow:
   *   1. Fetch the listing by ID
   *   2. Pass it to the edit form template
   *   3. Form displays current values for editing
   */
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// UPDATE ROUTE - Update existing listing
app.put("/listings/:id", async (req, res) => {
  /**
   * 📖 Update Route
   * ---------------
   * Purpose: Save edited listing data to database
   * 
   * Note: HTML forms can't send PUT requests natively.
   * We use method-override: action="/listings/<%= id %>?_method=PUT"
   * 
   * Mongoose Query:
   *   findByIdAndUpdate(id, updateData)
   * 
   * 📌 Spread operator (...):
   *   { ...req.body.listing } spreads all properties into a new object
   *   This is cleaner than listing each field individually
   */
  let { id } = req.params;
  try {
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  } catch (err) {
    res.status(400).send(`Unable to update listing: ${err.message}`);
  }
});

// DELETE ROUTE - Delete a listing
app.delete("/listings/:id", async (req, res) => {
  /**
   * 📖 Delete Route
   * ---------------
   * Purpose: Remove listing from database
   * 
   * Mongoose Query:
   *   findByIdAndDelete(id) → Find by ID and delete in one operation
   * 
   * 📌 Good practice: Log what was deleted for debugging
   */
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});


// =============================================================================
//                           START SERVER
// =============================================================================

app.listen(8080, () => {
  console.log("server is listening on 8080");
});
/**
 * 📖 Starting the Server
 * ----------------------
 * app.listen(port, callback) starts the HTTP server.
 * 
 * The callback runs after server starts successfully.
 * 
 * 📌 Server is now accessible at:
 *     http://localhost:8080
 * 
 * 📌 FOR YOUR INTERVIEW:
 * "The Express server listens on port 8080. For the AI features, it proxies
 * requests to a FastAPI Python service running on port 8000. This separation
 * allows us to use Python's superior AI/ML ecosystem while keeping Node.js
 * for the main web application."
 */


/**
 * ===================================================================================
 *                           📌 SUMMARY & CHEAT SHEET
 * ===================================================================================
 * 
 * 🎯 WHAT THIS FILE DOES:
 * -----------------------
 * 1. Sets up Express server on port 8080
 * 2. Connects to MongoDB (smartstay database)
 * 3. Configures middleware (body parsing, static files, method override)
 * 4. Defines routes for hotel listings (CRUD)
 * 5. Defines routes for AI feature pages
 * 6. Integrates AI routes module (/api/*)
 * 
 * 🎯 KEY PATTERNS:
 * ----------------
 * 1. MVC Architecture:
 *    - Model: models/listing.js
 *    - View: views/*.ejs
 *    - Controller: route handlers in this file
 * 
 * 2. RESTful Routes:
 *    - GET    /resource      → Index (list all)
 *    - GET    /resource/new  → New form
 *    - POST   /resource      → Create
 *    - GET    /resource/:id  → Show one
 *    - GET    /resource/:id/edit → Edit form
 *    - PUT    /resource/:id  → Update
 *    - DELETE /resource/:id  → Delete
 * 
 * 3. Async/Await:
 *    - All database operations use async/await
 *    - Cleaner than callbacks or .then() chains
 * 
 * 🎯 INTERVIEW QUESTIONS:
 * -----------------------
 * Q: "What is Express middleware?"
 * A: "Middleware are functions that run between receiving a request and sending
 *    a response. They can modify req/res, end the request cycle, or call next()
 *    to pass control to the next middleware."
 * 
 * Q: "How do you handle form data in Express?"
 * A: "I use express.urlencoded() middleware for HTML forms and express.json()
 *    for JSON data from API calls. Both parse the request body into req.body."
 * 
 * Q: "Why separate AI routes into a different file?"
 * A: "Separation of concerns. The main app.js handles core server setup and
 *    hotel CRUD operations. AI routes are more complex with FastAPI integration,
 *    so they live in their own module. This makes code easier to maintain."
 * 
 * Q: "How does your app connect to the AI service?"
 * A: "The routes/ai.js file acts as a proxy. When a request comes to /api/travel/plan,
 *    it forwards the request to FastAPI at http://localhost:8000/agent/travel-planner.
 *    FastAPI runs the LangGraph workflow and returns the result."
 * 
 * ===================================================================================
 */
