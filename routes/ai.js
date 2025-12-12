/**
 * ===================================================================================
 *                    🤖 AI ROUTES - Smart Stay AI Integration Layer
 * ===================================================================================
 * 
 * 📚 WHAT IS THIS FILE?
 * ---------------------
 * This file is the BRIDGE between Express (Node.js) and FastAPI (Python).
 * 
 * It handles all AI-related API endpoints and forwards requests to the
 * Python AI service running on port 8000.
 * 
 * 🔗 ARCHITECTURE:
 * ----------------
 * 
 *     Frontend (Browser)
 *           ↓
 *     Express (app.js, port 8080)
 *           ↓
 *     AI Routes (THIS FILE!)  ← You are here!
 *           ↓
 *     FastAPI (AI/main.py, port 8000)
 *           ↓
 *     LangGraph Workflows
 *         - travel_graph.py (8 nodes)
 *         - solo_trip_graph.py (11 nodes with HITL)
 * 
 * 📌 WHY SEPARATE EXPRESS AND FASTAPI?
 * ------------------------------------
 * 
 * 1. LANGUAGE STRENGTHS:
 *    - Node.js: Great for web servers, real-time apps, API handling
 *    - Python: Superior AI/ML ecosystem (LangChain, LangGraph, OpenAI)
 * 
 * 2. SEPARATION OF CONCERNS:
 *    - Express handles: User auth, sessions, templating, static files
 *    - FastAPI handles: AI workflows, LLM calls, vector search
 * 
 * 3. SCALABILITY:
 *    - Can scale Express and FastAPI independently
 *    - Can add more AI workers without touching main app
 * 
 * 📌 FOR YOUR INTERVIEW:
 * ----------------------
 * "I used a microservices architecture where Express handles the web application
 * and proxies AI requests to a FastAPI Python service. This lets me leverage
 * Python's superior AI libraries like LangGraph while keeping Node.js for
 * the main web application. The services communicate via REST APIs."
 * 
 * ===================================================================================
 *                           AI FEATURES OVERVIEW
 * ===================================================================================
 * 
 * 1. TRAVEL PLANNER (/api/travel/plan)
 *    - 8-node LangGraph workflow
 *    - Generates complete travel itineraries
 *    - Includes: destination research, transport, hotels, activities, food, etc.
 * 
 * 2. SOLO TRIP PLANNER (/api/travel/solo/*)
 *    - 11-node LangGraph with Human-in-the-Loop
 *    - Two-step process: start → user answers questions → resume
 *    - Personalized recommendations based on user preferences
 * 
 * 3. SMART CHAT (/api/chat/smart)
 *    - Auto-detects when to use tools
 *    - Can search web, get weather, find news
 *    - Maintains conversation memory
 * 
 * 4. NLP AMENITY EXTRACTION (/api/listings/:id/extract-amenities)
 *    - Extracts amenities from hotel descriptions using NLP
 *    - Example: "WiFi, pool, parking" from natural text
 * 
 * 5. AI HOTEL SEARCH (/api/hotels/search)
 *    - Natural language search across MongoDB
 *    - Scores hotels based on query relevance
 * 
 * ===================================================================================
 */

// =============================================================================
//                           IMPORTS
// =============================================================================

const express = require("express");
/**
 * 📖 Express Import
 * -----------------
 * We need express to create a Router.
 * A Router is like a mini-Express app that handles a group of routes.
 */

const router = express.Router();
/**
 * 📖 Express Router
 * -----------------
 * Router is a mini-application capable of performing middleware and routing.
 * 
 * We define routes on this router, then export it.
 * In app.js, we mount it with: app.use("/api", router)
 * 
 * This makes all routes here accessible under /api/*
 * 
 * 📌 WHY USE ROUTER?
 *    - Keeps related routes together
 *    - Cleaner code organization
 *    - Can have route-specific middleware
 */

const Listing = require("../models/listing.js");
/**
 * 📖 Listing Model Import
 * -----------------------
 * We need this for:
 *    - Fetching listing descriptions for amenity extraction
 *    - Updating listings with extracted amenities
 *    - Searching hotels in the database
 */


// =============================================================================
//                           CONFIGURATION
// =============================================================================

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
/**
 * 📖 FastAPI Service URL
 * ----------------------
 * URL where the Python AI service is running.
 * 
 * Uses environment variable if set, otherwise defaults to localhost:8000.
 * 
 * 📌 FOR PRODUCTION:
 *    Set AI_SERVICE_URL in your .env file or deployment config.
 *    Example: AI_SERVICE_URL=http://ai-service.internal:8000
 * 
 * 📌 COMMON PORTS:
 *    - 8080: Express (this app)
 *    - 8000: FastAPI (AI service)
 *    - 27017: MongoDB
 *    - 6333: Qdrant (vector database, if using)
 */


// =============================================================================
//           1. TRAVEL ITINERARY GENERATION (8-Node LangGraph)
// =============================================================================

/**
 * 📖 Travel Planner Endpoint
 * --------------------------
 * 
 * Route: POST /api/travel/plan
 * 
 * This endpoint generates complete travel itineraries using an 8-node
 * LangGraph workflow running in FastAPI.
 * 
 * 🔗 LANGGRAPH WORKFLOW (AI/travel_graph.py):
 * 
 *     START → Destination Researcher → Transport Finder → Accommodation Finder
 *           → Activities Planner → Food & Shopping → Travel Requirements
 *           → Emergency Info → Package Builder → END
 * 
 * Each node:
 *   1. Searches the web for relevant information
 *   2. Uses GPT to summarize findings
 *   3. Passes results to next node via state
 * 
 * 📌 FOR YOUR INTERVIEW:
 * "The Travel Planner uses a LangGraph workflow with 8 specialized nodes.
 * Each node handles one aspect of travel planning - destinations, transport,
 * hotels, activities, food, requirements, emergency info, and final packaging.
 * The workflow executes sequentially, building a comprehensive travel plan."
 */
router.post("/travel/plan", async (req, res) => {
    /**
     * POST /api/travel/plan
     * 
     * REQUEST BODY:
     * {
     *   query: "Plan a trip to Goa from Mumbai",  // Required
     *   source: "Mumbai",                          // Optional (extracted from query if not provided)
     *   destination: "Goa",                        // Optional (extracted from query if not provided)
     *   preferences: {                             // Optional
     *     vehicle_type: "petrol" | "diesel" | "ev",
     *     food_preference: "veg" | "nonveg" | "both",
     *     budget: "budget" | "midrange" | "luxury",
     *     interested_in_adventure: true | false,
     *     travel_mode: "flight" | "train" | "bus" | "car"
     *   }
     * }
     * 
     * RESPONSE:
     * {
     *   success: true,
     *   destination_info: "...",      // From Node 1
     *   transport_info: "...",        // From Node 2
     *   accommodation_info: "...",    // From Node 3
     *   activities_info: "...",       // From Node 4
     *   food_shopping_info: "...",    // From Node 5
     *   requirements_info: "...",     // From Node 6
     *   emergency_info: "...",        // From Node 7
     *   final_summary: "..."          // From Node 8 (2 packages)
     * }
     */
    try {
        const { query, source, destination, preferences } = req.body;

        // Validate required field
        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }

        // Forward request to FastAPI
        const response = await fetch(`${AI_SERVICE_URL}/agent/travel-planner`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query,
                source,
                destination,
                preferences
            })
        });
        /**
         * 📖 Fetch API
         * ------------
         * Native Node.js fetch (available in Node 18+).
         * 
         * We forward the request body to FastAPI and wait for response.
         * 
         * 📌 WHAT HAPPENS IN FASTAPI:
         *    1. Receives the request at /agent/travel-planner
         *    2. Runs the LangGraph workflow (8 nodes)
         *    3. Each node searches web + calls GPT
         *    4. Returns comprehensive travel plan
         */

        // Handle FastAPI errors
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`AI Service error: ${error}`);
        }

        // Return FastAPI response to client
        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Travel planner error:", error);
        res.status(500).json({ 
            error: "Failed to generate travel itinerary",
            details: error.message 
        });
    }
});


// =============================================================================
//           2. SOLO TRIP PLANNER (11-Node LangGraph with HITL)
// =============================================================================

/**
 * 📖 Solo Trip Planner - Human-in-the-Loop Pattern
 * ------------------------------------------------
 * 
 * This feature demonstrates the HITL (Human-in-the-Loop) pattern in LangGraph.
 * 
 * Unlike the Travel Planner (which runs start-to-finish), the Solo Planner
 * PAUSES to ask the user questions, then RESUMES with their answers.
 * 
 * 🔗 LANGGRAPH WORKFLOW (AI/solo_trip_graph.py):
 * 
 *     START → Parse Request → Ask Preferences → [INTERRUPT!]
 *                                                    ↓
 *                                          User answers questions
 *                                                    ↓
 *     [RESUME] → Research → Transport → Accommodation → Activities
 *             → Restaurants → Safety → Final Package → END
 * 
 * 📌 HOW HITL WORKS IN LANGGRAPH:
 * 
 *    1. Define graph with checkpointer (saves state between runs)
 *    2. Add interrupt_before=["node_name"] to pause at specific node
 *    3. First invoke() runs until interrupt, returns state with questions
 *    4. Second invoke() with user_responses resumes from checkpoint
 * 
 * 📌 FOR YOUR INTERVIEW:
 * "The Solo Planner uses LangGraph's Human-in-the-Loop feature. The workflow
 * pauses after generating personalization questions, waits for user input,
 * then resumes with the personalized responses. This is achieved using
 * LangGraph's checkpointing and interrupt_before mechanism."
 */

// START the solo trip planning (returns questions)
router.post("/travel/solo/start", async (req, res) => {
    /**
     * POST /api/travel/solo/start
     * 
     * STEP 1 of 2 in the HITL flow.
     * 
     * REQUEST BODY:
     * {
     *   query: "Plan a solo trip from Delhi to Goa",  // Required
     *   thread_id: "custom-id-123"                    // Optional (auto-generated if not provided)
     * }
     * 
     * RESPONSE:
     * {
     *   thread_id: "uuid-here",       // Use this to resume!
     *   status: "waiting_for_input",
     *   questions: {
     *     travel_mode: "How do you prefer to travel? (flight/train/bus/car)",
     *     food_preference: "Veg or non-veg?",
     *     budget_level: "Budget range? (budget/mid_range/luxury)",
     *     activity_interest: "Interested in adventure activities?"
     *   }
     * }
     * 
     * 📌 The workflow runs nodes 1-3, then pauses at node 4 (wait_for_input).
     */
    try {
        const { query, thread_id } = req.body;

        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }

        // Forward to FastAPI solo trip start endpoint
        const response = await fetch(`${AI_SERVICE_URL}/agent/solo-trip/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, thread_id })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`AI Service error: ${error}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Solo trip start error:", error);
        res.status(500).json({ 
            error: "Failed to start solo trip planning",
            details: error.message 
        });
    }
});

// RESUME the solo trip planning (after user answers)
router.post("/travel/solo/resume", async (req, res) => {
    /**
     * POST /api/travel/solo/resume
     * 
     * STEP 2 of 2 in the HITL flow.
     * 
     * REQUEST BODY:
     * {
     *   thread_id: "thread_id_from_start",  // Required (from /start response)
     *   user_responses: {                   // Answers to questions
     *     travel_mode: "car",
     *     food_preference: "veg",
     *     budget_level: "mid_range",
     *     activity_interest: "yes"
     *   }
     * }
     * 
     * RESPONSE:
     * {
     *   thread_id: "uuid-here",
     *   status: "complete",
     *   itinerary: {
     *     destination_info: "...",
     *     transport_info: "...",
     *     ... (personalized based on user_responses!)
     *   }
     * }
     * 
     * 📌 The workflow resumes from node 4, incorporating user responses,
     *    and runs nodes 5-11 to generate personalized itinerary.
     */
    try {
        const { thread_id, user_responses } = req.body;

        if (!thread_id) {
            return res.status(400).json({ error: "Thread ID is required" });
        }

        // Forward to FastAPI solo trip resume endpoint
        const response = await fetch(`${AI_SERVICE_URL}/agent/solo-trip/resume`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ thread_id, user_responses })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`AI Service error: ${error}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Solo trip resume error:", error);
        res.status(500).json({ 
            error: "Failed to resume solo trip planning",
            details: error.message 
        });
    }
});


// =============================================================================
//           3. SMART CHAT (Auto Tool Detection)
// =============================================================================

/**
 * 📖 Smart Chat Endpoint
 * ----------------------
 * 
 * Route: POST /api/chat/smart
 * 
 * An intelligent chat that automatically detects when to use tools.
 * 
 * For example:
 *   - "What's the weather in Mumbai?" → Uses weather tool
 *   - "Tell me about Tata Motors stock" → Uses stock tool
 *   - "Latest news about India" → Uses news tool
 *   - "Who was Gandhi?" → Direct LLM response (no tool needed)
 * 
 * 📌 FOR YOUR INTERVIEW:
 * "The Smart Chat uses an AI agent pattern. The LLM first analyzes the query
 * to decide if tools are needed. If yes, it selects the appropriate tool,
 * gets the result, and then formulates a response using that data."
 */
router.post("/chat/smart", async (req, res) => {
    /**
     * POST /api/chat/smart
     * 
     * REQUEST BODY:
     * {
     *   query: "What is the weather in Mumbai?",  // Required
     *   thread_id: "optional-thread-id",          // For conversation memory
     *   user_id: "optional-user-id",              // For personalization
     *   force_tool: null                          // Optional: force specific tool
     * }
     * 
     * RESPONSE:
     * {
     *   answer: "The weather in Mumbai is currently 28°C...",
     *   tool_used: "weather",        // Which tool was invoked (if any)
     *   tool_result: {...},          // Raw tool output
     *   thread_id: "abc123"          // For continuing conversation
     * }
     */
    try {
        const { query, thread_id, user_id, force_tool } = req.body;

        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }

        const response = await fetch(`${AI_SERVICE_URL}/agent/smart-chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query,
                thread_id: thread_id || "default",
                user_id: user_id || "default",
                force_tool
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`AI Service error: ${error}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Smart chat error:", error);
        res.status(500).json({ 
            error: "Failed to process chat request",
            details: error.message 
        });
    }
});


// =============================================================================
//           4. NLP AMENITY EXTRACTION
// =============================================================================

/**
 * 📖 NLP Amenity Extraction
 * -------------------------
 * 
 * This feature automatically extracts amenities from hotel descriptions
 * using Natural Language Processing.
 * 
 * Instead of manual checkbox selection, hotel owners just write a description,
 * and the AI identifies amenities like WiFi, Pool, Parking, etc.
 * 
 * 📌 EXAMPLE:
 * 
 *    Input Description:
 *    "Beautiful beachfront villa with free high-speed WiFi, infinity pool,
 *     complimentary parking, and 24-hour room service. All rooms have AC."
 * 
 *    Extracted Amenities:
 *    ["WiFi", "Pool", "Parking", "Room Service", "AC", "Beach Access"]
 * 
 * 📌 FOR YOUR INTERVIEW:
 * "I implemented NLP-based amenity extraction to improve data quality.
 * Instead of relying on hotel owners to manually select amenities from
 * checkboxes, the AI automatically extracts them from the description.
 * This ensures consistency and catches amenities that might be forgotten."
 */
router.post("/listings/:id/extract-amenities", async (req, res) => {
    /**
     * POST /api/listings/:id/extract-amenities
     * 
     * Extracts amenities from a listing's description and updates the database.
     * 
     * URL PARAMS:
     *   id: MongoDB ObjectId of the listing
     * 
     * RESPONSE:
     * {
     *   success: true,
     *   listing_id: "64abc123...",
     *   amenities: ["WiFi", "Pool", "Parking"],
     *   confidence: 0.95,
     *   count: 3,
     *   message: "Extracted 3 amenities"
     * }
     */
    try {
        const { id } = req.params;
        
        // Fetch listing from database
        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        if (!listing.description) {
            return res.status(400).json({ 
                error: "Listing has no description to extract from" 
            });
        }

        // Call FastAPI amenity extraction endpoint
        const response = await fetch(`${AI_SERVICE_URL}/tools/extract-amenities`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: listing.description
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`AI Service error: ${error}`);
        }

        const data = await response.json();
        const { amenities } = data;

        // Update listing in database with extracted amenities
        listing.amenities = amenities;
        await listing.save();
        /**
         * 📖 Updating the Database
         * ------------------------
         * After extracting amenities, we save them to the listing document.
         * This makes them searchable and displayable on the listing page.
         */

        res.json({
            success: true,
            listing_id: id,
            amenities: amenities,
            confidence: data.confidence,
            count: amenities.length,
            message: `Extracted ${amenities.length} amenities`
        });

    } catch (error) {
        console.error("Amenity extraction error:", error);
        res.status(500).json({ 
            error: "Failed to extract amenities",
            details: error.message 
        });
    }
});

// Test amenity extraction without saving (for demo/testing)
router.post("/test-extract-amenities", async (req, res) => {
    /**
     * POST /api/test-extract-amenities
     * 
     * Test the NLP extraction without affecting database.
     * Useful for demos and testing the AI capability.
     * 
     * REQUEST BODY:
     * {
     *   description: "This hotel has WiFi, pool, and parking..."
     * }
     */
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }

        const response = await fetch(`${AI_SERVICE_URL}/tools/extract-amenities`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`AI Service error: ${error}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Test amenity extraction error:", error);
        res.status(500).json({ 
            error: "Failed to extract amenities",
            details: error.message 
        });
    }
});

// Bulk extraction for all listings without amenities
router.post("/listings/bulk-extract-amenities", async (req, res) => {
    /**
     * POST /api/listings/bulk-extract-amenities
     * 
     * Processes all listings that don't have amenities yet.
     * Useful for initial data migration or setup.
     * 
     * 📌 This can take a while if you have many listings!
     */
    try {
        // Find listings without amenities
        const listings = await Listing.find({
            $or: [
                { amenities: { $exists: false } },
                { amenities: { $size: 0 } }
            ]
        });

        if (listings.length === 0) {
            return res.json({
                message: "All listings already have amenities",
                processed: 0,
                success: 0,
                failed: 0
            });
        }

        const results = [];
        let success = 0;
        let failed = 0;

        // Process each listing
        for (const listing of listings) {
            try {
                if (!listing.description) {
                    results.push({
                        listing_id: listing._id,
                        title: listing.title,
                        status: "skipped",
                        reason: "No description"
                    });
                    continue;
                }

                const response = await fetch(`${AI_SERVICE_URL}/tools/extract-amenities`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        description: listing.description
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                listing.amenities = data.amenities;
                await listing.save();

                results.push({
                    listing_id: listing._id,
                    title: listing.title,
                    status: "success",
                    amenities_count: data.amenities.length,
                    amenities: data.amenities
                });
                success++;

            } catch (error) {
                results.push({
                    listing_id: listing._id,
                    title: listing.title,
                    status: "failed",
                    error: error.message
                });
                failed++;
            }
        }

        res.json({
            processed: listings.length,
            success: success,
            failed: failed,
            results: results
        });

    } catch (error) {
        console.error("Bulk amenity extraction error:", error);
        res.status(500).json({ 
            error: "Failed to bulk extract amenities",
            details: error.message 
        });
    }
});


// =============================================================================
//           5. AI HOTEL SEARCH (MongoDB + Relevance Scoring)
// =============================================================================

/**
 * 📖 AI-Powered Hotel Search
 * --------------------------
 * 
 * This endpoint searches the MongoDB database using natural language queries.
 * It scores each hotel based on relevance to the search query.
 * 
 * Unlike simple filters, this understands queries like:
 *   - "budget hotel in Goa with pool"
 *   - "luxury beachfront resort for families"
 *   - "pet-friendly accommodation near airport"
 * 
 * 📌 HOW IT WORKS:
 * 
 *    1. Parse query for keywords (pool, wifi, budget, luxury, etc.)
 *    2. Apply basic filters (location, max price)
 *    3. Score each hotel based on:
 *       - Keyword matches in description
 *       - Keyword matches in amenities array
 *       - Location relevance
 *       - Price range alignment
 *    4. Sort by relevance score
 *    5. Return top matches
 * 
 * 📌 FOR YOUR INTERVIEW:
 * "The Hotel Search uses keyword extraction and relevance scoring rather than
 * exact string matching. When a user searches 'budget hotel with pool in Goa',
 * it extracts keywords, checks them against descriptions and amenities, and
 * scores hotels by how well they match. This provides more intelligent results
 * than simple database filters."
 */
router.get("/hotels/search", async (req, res) => {
    /**
     * GET /api/hotels/search
     * 
     * QUERY PARAMS:
     *   query: "budget hotel with pool in Goa"  // Natural language (optional)
     *   location: "Goa"                          // Filter by location (optional)
     *   maxPrice: 5000                           // Max price per night (optional)
     *   amenity: "Pool"                          // Filter by amenity (optional)
     * 
     * RESPONSE:
     * {
     *   success: true,
     *   count: 5,
     *   hotels: [
     *     {
     *       _id: "64abc...",
     *       title: "Beach Resort",
     *       price: 3500,
     *       location: "Calangute, Goa",
     *       amenities: ["Pool", "WiFi", "Parking"],
     *       matchScore: 85  // Relevance score (0-100)
     *     },
     *     ...
     *   ]
     * }
     */
    try {
        const { query, location, maxPrice, amenity } = req.query;
        
        // Build MongoDB filter for basic criteria
        let filter = {};
        
        // Location filter (case-insensitive partial match)
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }
        /**
         * 📖 MongoDB Regex
         * ----------------
         * $regex: location → matches if location appears anywhere
         * $options: 'i' → case-insensitive
         * 
         * Example: location = "goa" matches "Calangute, Goa", "North Goa", etc.
         */
        
        // Price filter (less than or equal)
        if (maxPrice) {
            filter.price = { $lte: parseInt(maxPrice) };
        }
        
        // Get all matching listings
        let hotels = await Listing.find(filter).lean();
        /**
         * 📖 .lean()
         * ----------
         * Returns plain JavaScript objects instead of Mongoose documents.
         * This is faster when you don't need Mongoose methods.
         * We use it because we're adding a custom matchScore property.
         */
        
        // If there's a natural language query, score by relevance
        if (query && hotels.length > 0) {
            const queryLower = query.toLowerCase();
            
            // Define keywords to look for
            const keywords = ['pool', 'wifi', 'parking', 'beach', 'ac', 'air conditioning', 
                             'kitchen', 'gym', 'spa', 'garden', 'luxury', 'budget', 
                             'family', 'couple', 'business', 'mountain', 'hill', 'sea'];
            
            // Score each hotel
            hotels = hotels.map(hotel => {
                let score = 0;
                const descLower = (hotel.description || '').toLowerCase();
                const titleLower = (hotel.title || '').toLowerCase();
                const locationLower = (hotel.location || '').toLowerCase();
                
                // Check for keyword matches
                keywords.forEach(keyword => {
                    if (queryLower.includes(keyword)) {
                        // Found in description or title
                        if (descLower.includes(keyword) || titleLower.includes(keyword)) {
                            score += 20;
                        }
                        // Found in amenities array (more valuable!)
                        if (hotel.amenities && hotel.amenities.some(a => a.toLowerCase().includes(keyword))) {
                            score += 25;
                        }
                    }
                });
                
                // Location match bonus
                if (queryLower.includes(locationLower.split(',')[0].toLowerCase())) {
                    score += 30;
                }
                
                // Price range bonus based on budget keywords
                if (queryLower.includes('budget') && hotel.price < 3000) score += 15;
                if (queryLower.includes('luxury') && hotel.price > 4000) score += 15;
                if (queryLower.includes('mid') && hotel.price >= 2500 && hotel.price <= 4500) score += 15;
                
                return { ...hotel, matchScore: Math.min(score, 100) };
            });
            
            // Sort by relevance score (highest first)
            hotels.sort((a, b) => b.matchScore - a.matchScore);
        }
        
        // Filter by specific amenity if requested
        if (amenity) {
            const amenityLower = amenity.toLowerCase();
            hotels = hotels.filter(hotel => {
                const desc = (hotel.description || '').toLowerCase();
                const amenities = hotel.amenities || [];
                return desc.includes(amenityLower) || 
                       amenities.some(a => a.toLowerCase().includes(amenityLower));
            });
        }
        
        // Limit results to top 20
        hotels = hotels.slice(0, 20);
        
        res.json({
            success: true,
            count: hotels.length,
            hotels: hotels
        });
        
    } catch (error) {
        console.error("Hotel search error:", error);
        res.status(500).json({ 
            error: "Failed to search hotels",
            details: error.message 
        });
    }
});


// =============================================================================
//                           EXPORT ROUTER
// =============================================================================

module.exports = router;
/**
 * 📖 Exporting the Router
 * -----------------------
 * We export the router so app.js can mount it.
 * 
 * In app.js:
 *     const aiRoutes = require("./routes/ai.js");
 *     app.use("/api", aiRoutes);
 * 
 * This makes all routes accessible under /api/*
 */


/**
 * ===================================================================================
 *                           📌 SUMMARY & CHEAT SHEET
 * ===================================================================================
 * 
 * 🎯 API ENDPOINTS:
 * -----------------
 * 
 * | Method | Endpoint                           | Description                    |
 * |--------|------------------------------------| -------------------------------|
 * | POST   | /api/travel/plan                   | Generate travel itinerary      |
 * | POST   | /api/travel/solo/start             | Start HITL solo planner        |
 * | POST   | /api/travel/solo/resume            | Resume HITL with user answers  |
 * | POST   | /api/chat/smart                    | Smart chat with auto tools     |
 * | POST   | /api/listings/:id/extract-amenities| Extract amenities from listing |
 * | POST   | /api/test-extract-amenities        | Test extraction (no save)      |
 * | POST   | /api/listings/bulk-extract-amenities| Bulk process all listings     |
 * | GET    | /api/hotels/search                 | AI-powered hotel search        |
 * 
 * 🎯 AI FEATURES RECAP:
 * --------------------
 * 
 * 1. TRAVEL PLANNER:
 *    - 8-node LangGraph workflow
 *    - Nodes: Destination → Transport → Hotel → Activities → Food → Requirements → Emergency → Package
 *    - Output: 2 travel packages with booking links
 * 
 * 2. SOLO PLANNER (HITL):
 *    - 11-node LangGraph with interrupt
 *    - Step 1: /start → Returns questions
 *    - Step 2: /resume → User answers → Personalized itinerary
 * 
 * 3. SMART CHAT:
 *    - Auto-detects when tools are needed
 *    - Tools: web search, weather, news, stock
 *    - Maintains conversation memory
 * 
 * 4. NLP EXTRACTION:
 *    - Extracts amenities from description text
 *    - Updates MongoDB with extracted amenities
 *    - Improves search and data quality
 * 
 * 5. HOTEL SEARCH:
 *    - Natural language understanding
 *    - Keyword matching with relevance scoring
 *    - Searches both description and amenities
 * 
 * 🎯 INTERVIEW QUESTIONS:
 * -----------------------
 * 
 * Q: "How does Express communicate with FastAPI?"
 * A: "Express acts as a proxy. When a request comes to /api/travel/plan,
 *    Express forwards it to FastAPI at http://localhost:8000/agent/travel-planner
 *    using the native fetch API. FastAPI processes it, runs the LangGraph
 *    workflow, and returns JSON which Express passes back to the client."
 * 
 * Q: "Why not put AI logic directly in Express?"
 * A: "Python has superior AI/ML libraries - LangChain, LangGraph, OpenAI.
 *    By using FastAPI for AI and Express for web app, we leverage the
 *    strengths of each language. It also allows independent scaling."
 * 
 * Q: "Explain the Human-in-the-Loop pattern"
 * A: "The workflow pauses at a designated node using LangGraph's interrupt_before.
 *    The state is saved to a checkpointer. When we call resume, LangGraph loads
 *    the state, merges user responses, and continues from where it paused."
 * 
 * Q: "How does the hotel search work?"
 * A: "It's keyword-based relevance scoring. I extract keywords from the query,
 *    check each hotel's description and amenities array for matches, calculate
 *    a score, and sort by relevance. This gives smarter results than exact
 *    string matching."
 * 
 * ===================================================================================
 */
