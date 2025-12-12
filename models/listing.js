/**
 * ===================================================================================
 *                    🏨 LISTING MODEL - Hotel/Property Schema
 * ===================================================================================
 * 
 * 📚 WHAT IS THIS FILE?
 * ---------------------
 * This file defines the MongoDB SCHEMA and MODEL for hotel listings.
 * 
 * Think of it as:
 *   - Schema = Blueprint (defines structure)
 *   - Model = Factory (creates documents based on blueprint)
 * 
 * 🔗 HOW IT CONNECTS:
 * -------------------
 * 
 *     app.js
 *         ↓
 *     const Listing = require("./models/listing.js")  ← THIS FILE!
 *         ↓
 *     Listing.find(), Listing.create(), etc.
 *         ↓
 *     MongoDB (smartstay database, listings collection)
 * 
 * 📌 FOR YOUR INTERVIEW:
 * ----------------------
 * "I used Mongoose to define schemas for my MongoDB collections. The Listing
 * schema includes fields like title, description, price, location, and an
 * amenities array that gets populated by our NLP amenity extraction feature."
 * 
 * ===================================================================================
 *                           MONGOOSE CONCEPTS
 * ===================================================================================
 * 
 * 📖 SCHEMA vs MODEL vs DOCUMENT
 * ------------------------------
 * 
 * SCHEMA:
 *   - Defines the structure of documents
 *   - Specifies field types, defaults, validation
 *   - Like a "class definition" or "table structure"
 * 
 * MODEL:
 *   - A constructor compiled from a Schema
 *   - Provides interface to the database (CRUD operations)
 *   - Like a "class" you can instantiate
 * 
 * DOCUMENT:
 *   - An instance of a Model
 *   - Represents a single record in MongoDB
 *   - Like an "object" or "row"
 * 
 * 📌 Example:
 *     Schema defines: { title: String, price: Number }
 *     Model = mongoose.model("Listing", schema)
 *     Document = new Listing({ title: "Beach Hotel", price: 5000 })
 * 
 * ===================================================================================
 */

// =============================================================================
//                           IMPORTS
// =============================================================================

const mongoose = require("mongoose");
/**
 * 📖 Mongoose Import
 * ------------------
 * Mongoose is an ODM (Object Document Mapper) for MongoDB.
 * 
 * It provides:
 *   - Schema definitions
 *   - Model creation
 *   - Validation
 *   - Middleware hooks
 *   - Query helpers
 * 
 * 🔗 Alternative: You could use the raw MongoDB driver, but Mongoose
 *    adds structure and validation that makes development easier.
 */

const Schema = mongoose.Schema;
/**
 * 📖 Schema Class
 * ---------------
 * We extract Schema from mongoose so we don't have to write
 * mongoose.Schema every time.
 * 
 * This is a common pattern in Mongoose code.
 * 
 * 📌 Same as:
 *     const { Schema } = mongoose;  // Destructuring syntax
 */


// =============================================================================
//                           SCHEMA DEFINITION
// =============================================================================

/**
 * 📖 Listing Schema
 * -----------------
 * Defines the structure for hotel/property listings.
 * 
 * Each listing has:
 *   - title: Hotel name (required)
 *   - description: Detailed description
 *   - image: Photo URL (with default)
 *   - price: Price per night
 *   - location: City/area
 *   - country: Country name
 *   - amenities: Array of amenity strings (extracted by NLP!)
 * 
 * 📌 FOR YOUR INTERVIEW:
 * "The amenities field is an array of strings that gets populated by our
 * NLP amenity extraction feature. When a hotel owner adds a description,
 * the AI automatically extracts amenities like WiFi, Pool, Parking, etc."
 */
const listingSchema = new Schema({
  
  // ==========================================================================
  // TITLE FIELD
  // ==========================================================================
  title: {
    type: String,
    required: true,
    /**
     * 📖 Required Field
     * -----------------
     * required: true means this field MUST be provided.
     * 
     * If you try to save a Listing without title:
     *     new Listing({ price: 5000 }).save()
     * 
     * Mongoose will throw a ValidationError:
     *     "Path `title` is required."
     * 
     * 📌 You can also provide custom error message:
     *     required: [true, "Title is required for listing"]
     */
  },

  // ==========================================================================
  // DESCRIPTION FIELD
  // ==========================================================================
  description: String,
  /**
   * 📖 Simple Field Declaration
   * ---------------------------
   * When you don't need options, you can just specify the type.
   * 
   * description: String 
   * is shorthand for:
   * description: { type: String }
   * 
   * 📌 This field is used by:
   *    - Display on listing pages
   *    - NLP Amenity Extraction (POST /api/listings/:id/extract-amenities)
   *    - AI Hotel Search matching
   */

  // ==========================================================================
  // IMAGE FIELD
  // ==========================================================================
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    /**
     * 📖 Default Value
     * ----------------
     * If image is not provided, use this default Unsplash image.
     * 
     * 📌 Good practice: Always have a fallback image so UI doesn't break.
     */
    
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        : v,
    /**
     * 📖 Setter Function
     * ------------------
     * set: is a Mongoose setter that transforms the value before saving.
     * 
     * This setter says:
     *   - If value is empty string "", use default image
     *   - Otherwise, use the provided value
     * 
     * 📌 WHY?
     * HTML forms submit empty inputs as "" (empty string), not null.
     * Without this setter, image would be "" instead of the default.
     * 
     * 📌 Example:
     *     User leaves image field empty in form
     *     Form submits: { image: "" }
     *     Setter converts "" to default URL
     *     Saved document has the default image
     */
  },

  // ==========================================================================
  // PRICE FIELD
  // ==========================================================================
  price: Number,
  /**
   * 📖 Price per Night
   * ------------------
   * Stored as Number (not String) for:
   *   - Mathematical operations (sorting, filtering by range)
   *   - Proper comparisons ($lte, $gte in queries)
   * 
   * 📌 In views, display with currency:
   *     ₹<%= listing.price.toLocaleString("en-IN") %> per night
   */

  // ==========================================================================
  // LOCATION FIELD
  // ==========================================================================
  location: String,
  /**
   * 📖 Location
   * -----------
   * City or area name, e.g., "Calangute Beach, Goa"
   * 
   * 📌 Used for:
   *    - Display
   *    - Search filtering (GET /api/hotels/search?location=Goa)
   *    - AI matching in hotel finder
   */

  // ==========================================================================
  // COUNTRY FIELD
  // ==========================================================================
  country: String,
  /**
   * 📖 Country
   * ----------
   * Country name, e.g., "India"
   * 
   * 📌 Useful for:
   *    - International listings
   *    - Country-based filtering
   */

  // ==========================================================================
  // AMENITIES FIELD (AI-POWERED!)
  // ==========================================================================
  amenities: {
    type: [String],
    default: [],
    /**
     * 📖 Amenities Array
     * ------------------
     * An array of strings representing hotel amenities.
     * 
     * type: [String] means "array of strings"
     * default: [] means empty array if not provided
     * 
     * 📌 EXAMPLE VALUES:
     *     ["WiFi", "Pool", "Parking", "AC", "Kitchen", "Beach Access"]
     * 
     * 📌 HOW THEY'RE EXTRACTED (AI FEATURE!):
     *    
     *    1. Hotel owner writes description:
     *       "Beautiful beachfront villa with free WiFi, swimming pool,
     *        and private parking. All rooms are air-conditioned."
     *    
     *    2. Call AI extraction endpoint:
     *       POST /api/listings/:id/extract-amenities
     *    
     *    3. FastAPI uses NLP to extract:
     *       ["WiFi", "Pool", "Parking", "AC", "Beach Access"]
     *    
     *    4. This field gets updated with extracted amenities
     * 
     * 📌 FOR YOUR INTERVIEW:
     * "The amenities field is populated by our NLP extraction feature.
     * Instead of making hotel owners manually check boxes for amenities,
     * we use AI to automatically extract them from the description text.
     * This improves data quality and user experience."
     * 
     * 📌 USED IN SEARCH:
     * The AI Hotel Finder (GET /api/hotels/search) searches this array
     * when users ask for specific amenities:
     *     "Find hotels with pool and WiFi in Goa"
     */
  },
});


// =============================================================================
//                           MODEL CREATION
// =============================================================================

const Listing = mongoose.model("Listing", listingSchema);
/**
 * 📖 Creating the Model
 * ---------------------
 * mongoose.model(modelName, schema) creates a Model.
 * 
 * Parameters:
 *   - "Listing" = Model name (MongoDB will create collection as "listings")
 *   - listingSchema = The schema to use
 * 
 * 📌 COLLECTION NAMING:
 * Mongoose automatically pluralizes and lowercases the model name:
 *   - "Listing" → "listings" collection in MongoDB
 *   - "User" → "users" collection
 *   - "Category" → "categories" collection
 * 
 * 📌 WHAT CAN YOU DO WITH A MODEL?
 * 
 * CREATE:
 *     const hotel = new Listing({ title: "Beach Hotel", price: 5000 });
 *     await hotel.save();
 *     // OR
 *     await Listing.create({ title: "Beach Hotel", price: 5000 });
 * 
 * READ:
 *     const all = await Listing.find({});                    // All
 *     const one = await Listing.findById(id);                // By ID
 *     const filtered = await Listing.find({ country: "India" }); // Filtered
 *     const cheap = await Listing.find({ price: { $lte: 3000 } }); // Price <= 3000
 * 
 * UPDATE:
 *     await Listing.findByIdAndUpdate(id, { price: 6000 });
 *     await Listing.updateOne({ title: "Old" }, { title: "New" });
 * 
 * DELETE:
 *     await Listing.findByIdAndDelete(id);
 *     await Listing.deleteMany({ country: "Test" });
 */


// =============================================================================
//                           EXPORT
// =============================================================================

module.exports = Listing;
/**
 * 📖 Exporting the Model
 * ----------------------
 * module.exports makes this model available to other files.
 * 
 * In app.js:
 *     const Listing = require("./models/listing.js");
 *     const hotels = await Listing.find({});
 * 
 * In routes/ai.js:
 *     const Listing = require("../models/listing.js");
 *     const listing = await Listing.findById(id);
 */


/**
 * ===================================================================================
 *                           📌 SUMMARY & CHEAT SHEET
 * ===================================================================================
 * 
 * 🎯 SCHEMA FIELDS:
 * -----------------
 * | Field       | Type     | Required | Default        | Notes                    |
 * |-------------|----------|----------|----------------|--------------------------|
 * | title       | String   | Yes      | -              | Hotel name               |
 * | description | String   | No       | -              | Used for NLP extraction  |
 * | image       | String   | No       | Unsplash URL   | Has setter for empty ""  |
 * | price       | Number   | No       | -              | Price per night in ₹     |
 * | location    | String   | No       | -              | City/area                |
 * | country     | String   | No       | -              | Country name             |
 * | amenities   | [String] | No       | []             | AI-extracted from desc   |
 * 
 * 🎯 COMMON MONGOOSE QUERIES:
 * --------------------------
 * 
 * // Find all
 * await Listing.find({});
 * 
 * // Find with filter
 * await Listing.find({ location: /goa/i });  // Case-insensitive regex
 * 
 * // Find by ID
 * await Listing.findById("64abc123...");
 * 
 * // Find one
 * await Listing.findOne({ title: "Beach Resort" });
 * 
 * // Create
 * await Listing.create({ title: "New Hotel", price: 3000 });
 * 
 * // Update
 * await Listing.findByIdAndUpdate(id, { price: 5000 });
 * 
 * // Delete
 * await Listing.findByIdAndDelete(id);
 * 
 * // Count
 * await Listing.countDocuments({ country: "India" });
 * 
 * // Sort and limit
 * await Listing.find({}).sort({ price: 1 }).limit(10);  // 1 = ascending
 * 
 * 🎯 INTERVIEW QUESTIONS:
 * -----------------------
 * 
 * Q: "What is the difference between Schema and Model in Mongoose?"
 * A: "A Schema defines the structure - field types, defaults, validation rules.
 *    A Model is a constructor compiled from the Schema that provides the
 *    interface for database operations like find(), create(), update()."
 * 
 * Q: "How does Mongoose handle validation?"
 * A: "You can add validation in the Schema definition. Built-in validators
 *    include required, min, max, enum, match (regex). You can also define
 *    custom validators. Validation runs before saving to the database."
 * 
 * Q: "What is the amenities field used for?"
 * A: "It's an array of strings representing hotel amenities like WiFi, Pool,
 *    Parking. Instead of manual entry, we use NLP to extract these from the
 *    hotel description. This powers our AI hotel search feature."
 * 
 * Q: "Why use a setter for the image field?"
 * A: "HTML forms submit empty inputs as empty strings, not null. The setter
 *    converts empty strings to the default image URL, ensuring we always
 *    have a valid image to display."
 * 
 * ===================================================================================
 */
