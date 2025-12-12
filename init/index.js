/**
 * =============================================================================
 *                    INDEX.JS - Database Initialization Script
 * =============================================================================
 *
 * 📚 WHAT IS THIS FILE?
 * ---------------------
 * This is a DATABASE SEEDING SCRIPT. It populates your MongoDB with sample data.
 * Think of it as "setting up the initial state" of your database.
 *
 * 🔗 HOW TO RUN:
 * -------------
 *     cd "/path/to/Smart Stay"
 *     node init/index.js
 *
 * ⚠️ WARNING: This will DELETE all existing listings and replace them with
 * the sample data from data.js!
 *
 * 📌 WHAT IT DOES:
 * ---------------
 * 1. Connects to MongoDB (smartstay database)
 * 2. Deletes ALL existing listings (clean slate)
 * 3. Inserts ALL sample listings from data.js
 * 4. Closes connection and exits
 *
 * 🔗 YOUR NOTES CONNECTION:
 * -------------------------
 * This is a common pattern in Node.js projects:
 *   - mongoose.connect() → Connect to DB
 *   - Model.deleteMany({}) → Delete all documents
 *   - Model.insertMany([]) → Insert multiple documents
 *
 * 📖 INTERVIEW TIP:
 * ----------------
 * "I created a database seeding script to initialize the application with
 * sample data. This is useful for development, testing, and demos. The script
 * follows best practices by properly closing the MongoDB connection after
 * completion."
 *
 * =============================================================================
 */

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

/**
 * MongoDB Connection URL
 * - 127.0.0.1 = localhost (your local machine)
 * - 27017 = default MongoDB port
 * - smartstay = database name (created automatically if doesn't exist)
 */
const MONGO_URL = "mongodb://127.0.0.1:27017/smartstay";

/**
 * Connect to MongoDB
 * Using async/await pattern with .then()/.catch() for error handling
 */
main()
  .then(async () => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
  })

async function main() {
  await mongoose.connect(MONGO_URL);
}

/**
 * Initialize Database Function
 * 
 * Steps:
 * 1. deleteMany({}) - Empty filter means "delete ALL documents"
 * 2. insertMany() - Insert array of documents
 * 3. Close connection - Important for scripts (not servers)!
 * 4. Exit process - Clean exit with code 0 (success)
 */
const initDB = async () => {
  // Delete existing data (clean slate)
  await Listing.deleteMany({});
  console.log("🗑️  Cleared existing listings");
  
  // Insert sample data from data.js
  await Listing.insertMany(initData.data);
  console.log(`✅ Inserted ${initData.data.length} sample listings`);
  
  // Close MongoDB connection (important for scripts!)
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed");
  
  // Exit the script
  process.exit(0);
};

// Run the initialization
initDB();