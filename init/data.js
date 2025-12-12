/**
 * =============================================================================
 *                    DATA.JS - Sample Hotel Listings Data
 * =============================================================================
 *
 * 📚 WHAT IS THIS FILE?
 * ---------------------
 * This file contains sample data (seed data) for hotel listings across India.
 * It's used to populate the MongoDB database with initial listings.
 *
 * 🔗 HOW IT'S USED:
 * ----------------
 * This data is imported by `init/index.js` and inserted into MongoDB.
 * Run: `node init/index.js` to populate the database.
 *
 * 📌 DATA STRUCTURE:
 * -----------------
 * Each listing has:
 *   - title: String (name of the property)
 *   - description: String (details with amenities - IMPORTANT for AI extraction!)
 *   - image: String (Unsplash URL for the image)
 *   - price: Number (price per night in INR)
 *   - location: String (city, state)
 *   - country: String (always "India" for now)
 *
 * 🤖 AI FEATURE CONNECTION:
 * -------------------------
 * The `description` field is used by the NLP Amenity Extraction feature!
 * When you call POST /api/listings/:id/extract-amenities, the AI reads
 * the description and extracts amenities like "WiFi", "Pool", "Parking".
 *
 * 📖 INTERVIEW TIP:
 * ----------------
 * "I created comprehensive seed data with detailed descriptions that include
 * amenities. This allows my NLP extraction feature to demonstrate real-world
 * value by extracting structured data from unstructured text descriptions."
 *
 * =============================================================================
 */

// Smart Stay - India Hotel Listings with Working Images

const sampleListings = [
  // ============================================================================
  // GOA - Beach Destinations
  // ============================================================================
  {
    title: "Luxury Beachfront Villa in Calangute",
    description: "Stunning beachfront villa with private pool, fully equipped kitchen, high-speed WiFi, air conditioning, and secure parking. Perfect for families with direct beach access and ocean views.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    price: 3500,
    location: "Calangute, Goa",
    country: "India",
  },
  {
    title: "Modern Apartment in Panaji",
    description: "Centrally located modern apartment in Goa's capital. Features WiFi, air conditioning, fully equipped kitchen, and parking. Walking distance to restaurants and shopping.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    price: 1800,
    location: "Panaji, Goa",
    country: "India",
  },
  {
    title: "Seaside Cottage in Anjuna",
    description: "Charming seaside cottage with private garden, WiFi, kitchen facilities, and parking. Close to Anjuna Beach and famous flea market. Perfect for couples.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    price: 2200,
    location: "Anjuna, Goa",
    country: "India",
  },
  {
    title: "Heritage Portuguese Villa in Fontainhas",
    description: "Beautifully restored Portuguese colonial villa in Old Goa. Features WiFi, air conditioning, private pool, garden, and parking. Experience Goa's rich history.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
    price: 4500,
    location: "Fontainhas, Goa",
    country: "India",
  },
  {
    title: "Beachfront Resort in Baga",
    description: "Luxury beachfront resort with infinity pool, spa, gym, WiFi, air conditioning, multiple restaurants, and beach access. Perfect for families and couples.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    price: 5000,
    location: "Baga, Goa",
    country: "India",
  },
  {
    title: "Eco-Friendly Treehouse in South Goa",
    description: "Unique eco-friendly treehouse retreat surrounded by coconut groves. Features WiFi, outdoor kitchen, parking, and close to Colva Beach. Perfect for nature lovers.",
    image: "https://images.unsplash.com/photo-1618767689160-da3fb810aad7?w=800&h=600&fit=crop",
    price: 2800,
    location: "South Goa",
    country: "India",
  },

  // ============================================================================
  // MUMBAI - Metropolitan City
  // ============================================================================
  {
    title: "Luxury Apartment in Bandra",
    description: "Modern luxury apartment in upscale Bandra. Features WiFi, air conditioning, fully equipped kitchen, gym access, parking, and proximity to restaurants and beaches.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    price: 4000,
    location: "Bandra, Mumbai",
    country: "India",
  },
  {
    title: "Heritage Bungalow in Colaba",
    description: "Beautiful heritage bungalow in historic Colaba. Features WiFi, air conditioning, garden, parking, and walking distance to Gateway of India and restaurants.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    price: 3500,
    location: "Colaba, Mumbai",
    country: "India",
  },
  {
    title: "Sea-Facing Studio in Juhu",
    description: "Cozy sea-facing studio apartment with WiFi, air conditioning, kitchenette, and parking. Direct views of Juhu Beach, perfect for solo travelers.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    price: 2500,
    location: "Juhu, Mumbai",
    country: "India",
  },
  {
    title: "Business Hotel in Andheri",
    description: "Modern business hotel with WiFi, air conditioning, conference facilities, gym, restaurant, parking, and close to airport. Perfect for business travelers.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    price: 3000,
    location: "Andheri, Mumbai",
    country: "India",
  },

  // ============================================================================
  // DELHI - Capital City
  // ============================================================================
  {
    title: "Luxury Hotel in Connaught Place",
    description: "Premium hotel in heart of Delhi with WiFi, air conditioning, multiple restaurants, spa, gym, parking, and walking distance to shopping and metro.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
    price: 4500,
    location: "Connaught Place, Delhi",
    country: "India",
  },
  {
    title: "Heritage Haveli in Old Delhi",
    description: "Beautifully restored haveli in Old Delhi. Features WiFi, air conditioning, traditional courtyard, parking, and close to Red Fort and Jama Masjid.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop",
    price: 2800,
    location: "Old Delhi",
    country: "India",
  },
  {
    title: "Modern Apartment in Gurgaon",
    description: "Contemporary apartment in Gurgaon with WiFi, air conditioning, fully equipped kitchen, gym access, parking, and close to business district.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    price: 3500,
    location: "Gurgaon, Delhi NCR",
    country: "India",
  },

  // ============================================================================
  // RAJASTHAN - Heritage & Culture
  // ============================================================================
  {
    title: "Royal Palace Hotel in Jaipur",
    description: "Luxury palace hotel with WiFi, air conditioning, multiple restaurants, spa, pool, parking, and close to City Palace and Hawa Mahal. Experience royal hospitality.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop",
    price: 5500,
    location: "Jaipur, Rajasthan",
    country: "India",
  },
  {
    title: "Heritage Haveli in Udaipur",
    description: "Beautiful heritage haveli overlooking Lake Pichola. Features WiFi, air conditioning, rooftop restaurant, parking, and stunning lake views.",
    image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&h=600&fit=crop",
    price: 4800,
    location: "Udaipur, Rajasthan",
    country: "India",
  },
  {
    title: "Desert Camp in Jaisalmer",
    description: "Authentic desert camp experience with WiFi, air conditioning, traditional meals, camel rides, cultural performances, and parking. Unique desert experience.",
    image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800&h=600&fit=crop",
    price: 3200,
    location: "Jaisalmer, Rajasthan",
    country: "India",
  },
  {
    title: "Blue City Guesthouse in Jodhpur",
    description: "Charming guesthouse in blue city with WiFi, air conditioning, rooftop terrace, parking, and close to Mehrangarh Fort. Experience Jodhpur's blue houses.",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop",
    price: 2200,
    location: "Jodhpur, Rajasthan",
    country: "India",
  },

  // ============================================================================
  // KERALA - Backwaters & Beaches
  // ============================================================================
  {
    title: "Houseboat in Alleppey Backwaters",
    description: "Traditional Kerala houseboat with WiFi, air conditioning, fully equipped kitchen, private deck, and parking. Experience Kerala's famous backwaters.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop",
    price: 4500,
    location: "Alleppey, Kerala",
    country: "India",
  },
  {
    title: "Beach Resort in Kovalam",
    description: "Luxury beach resort with WiFi, air conditioning, private beach access, pool, spa, multiple restaurants, parking, and Ayurvedic treatments.",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
    price: 5000,
    location: "Kovalam, Kerala",
    country: "India",
  },
  {
    title: "Hill Station Resort in Munnar",
    description: "Mountain resort in tea country with WiFi, air conditioning, garden, restaurant, parking, and stunning tea plantation views. Perfect for nature lovers.",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=600&fit=crop",
    price: 3800,
    location: "Munnar, Kerala",
    country: "India",
  },

  // ============================================================================
  // HIMACHAL PRADESH - Hill Stations
  // ============================================================================
  {
    title: "Mountain Cabin in Manali",
    description: "Cozy mountain cabin with WiFi, heating, kitchen, parking, and stunning mountain views. Close to Solang Valley and adventure activities.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=600&fit=crop",
    price: 2800,
    location: "Manali, Himachal Pradesh",
    country: "India",
  },
  {
    title: "Heritage Hotel in Shimla",
    description: "Beautiful heritage hotel with WiFi, heating, multiple restaurants, parking, and colonial charm. Close to Mall Road and Shimla Ridge.",
    image: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=800&h=600&fit=crop",
    price: 3500,
    location: "Shimla, Himachal Pradesh",
    country: "India",
  },
  {
    title: "Mountain View Resort in Dharamshala",
    description: "Peaceful resort with WiFi, heating, garden, restaurant, parking, and stunning views of Dhauladhar range. Close to Dalai Lama Temple.",
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&h=600&fit=crop",
    price: 3200,
    location: "Dharamshala, Himachal Pradesh",
    country: "India",
  },

  // ============================================================================
  // UTTARAKHAND - Spiritual & Adventure
  // ============================================================================
  {
    title: "Yoga Retreat in Rishikesh",
    description: "Peaceful yoga retreat with WiFi, air conditioning, yoga hall, vegetarian meals, parking, and close to Ganges. Perfect for spiritual seekers.",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop",
    price: 2500,
    location: "Rishikesh, Uttarakhand",
    country: "India",
  },
  {
    title: "Mountain Lodge in Mussoorie",
    description: "Charming mountain lodge with WiFi, heating, garden, restaurant, parking, and stunning views of Doon Valley. Close to Mall Road.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    price: 3000,
    location: "Mussoorie, Uttarakhand",
    country: "India",
  },
  {
    title: "Adventure Resort in Nainital",
    description: "Lakeside resort with WiFi, heating, lake access, boating, restaurant, parking, and close to Naini Lake. Perfect for families.",
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop",
    price: 3200,
    location: "Nainital, Uttarakhand",
    country: "India",
  },

  // ============================================================================
  // TAMIL NADU - Temples & Beaches
  // ============================================================================
  {
    title: "Beach Resort in Mahabalipuram",
    description: "Luxury beach resort with WiFi, air conditioning, private beach, pool, spa, restaurant, parking, and close to UNESCO heritage sites.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
    price: 4500,
    location: "Mahabalipuram, Tamil Nadu",
    country: "India",
  },
  {
    title: "Hill Station Hotel in Ooty",
    description: "Charming hill station hotel with WiFi, heating, garden, restaurant, parking, and stunning Nilgiri mountain views. Close to Ooty Lake.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
    price: 3000,
    location: "Ooty, Tamil Nadu",
    country: "India",
  },
  {
    title: "Beachfront Villa in Pondicherry",
    description: "French colonial villa with WiFi, air conditioning, private pool, garden, parking, and close to Promenade Beach. Experience Pondicherry's French Quarter.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    price: 4000,
    location: "Pondicherry",
    country: "India",
  },

  // ============================================================================
  // BANGALORE - Tech Hub
  // ============================================================================
  {
    title: "Luxury Serviced Apartment in Koramangala",
    description: "Modern serviced apartment in tech hub Koramangala. Features WiFi, air conditioning, fully equipped kitchen, gym, parking, and close to IT parks.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    price: 3800,
    location: "Koramangala, Bangalore",
    country: "India",
  },
  {
    title: "Modern Studio in Indiranagar",
    description: "Stylish studio apartment with WiFi, air conditioning, kitchenette, parking, and close to restaurants and nightlife. Perfect for young professionals.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    price: 2200,
    location: "Indiranagar, Bangalore",
    country: "India",
  },

  // ============================================================================
  // HYDERABAD - Tech & Heritage
  // ============================================================================
  {
    title: "Luxury Hotel in Hitech City",
    description: "Modern luxury hotel in tech hub with WiFi, air conditioning, multiple restaurants, spa, gym, pool, parking, and close to IT parks.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    price: 4200,
    location: "Hitech City, Hyderabad",
    country: "India",
  },
  {
    title: "Heritage Palace Hotel near Charminar",
    description: "Beautiful heritage palace hotel with WiFi, air conditioning, multiple restaurants, garden, parking, and close to Charminar and Old City.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
    price: 3800,
    location: "Old City, Hyderabad",
    country: "India",
  },

  // ============================================================================
  // UTTAR PRADESH - Heritage & Spirituality
  // ============================================================================
  {
    title: "Luxury Hotel near Taj Mahal",
    description: "Premium hotel near Taj Mahal with WiFi, air conditioning, multiple restaurants, spa, pool, parking, and close to Agra Fort. Perfect for tourists.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop",
    price: 4500,
    location: "Agra, Uttar Pradesh",
    country: "India",
  },
  {
    title: "Spiritual Guesthouse in Varanasi",
    description: "Simple guesthouse near Ganges with WiFi, air conditioning, rooftop terrace, vegetarian meals, parking, and close to ghats. Perfect for spiritual experience.",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&h=600&fit=crop",
    price: 1800,
    location: "Varanasi, Uttar Pradesh",
    country: "India",
  },

  // ============================================================================
  // ANDAMAN & NICOBAR - Islands
  // ============================================================================
  {
    title: "Beach Resort in Havelock Island",
    description: "Luxury beach resort with WiFi, air conditioning, private beach, pool, spa, restaurant, parking, and close to Radhanagar Beach. Perfect for couples.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    price: 5500,
    location: "Havelock Island, Andaman",
    country: "India",
  },
  {
    title: "Beachfront Villa in Port Blair",
    description: "Stunning beachfront villa with WiFi, air conditioning, private pool, fully equipped kitchen, parking, and close to Cellular Jail.",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
    price: 4800,
    location: "Port Blair, Andaman",
    country: "India",
  },

  // ============================================================================
  // MORE DESTINATIONS
  // ============================================================================
  {
    title: "Beach Resort in Gokarna",
    description: "Peaceful beach resort with WiFi, air conditioning, private beach access, restaurant, parking, and close to Om Beach. Perfect for spiritual beach experience.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    price: 2500,
    location: "Gokarna, Karnataka",
    country: "India",
  },
  {
    title: "Hill Station Hotel in Coorg",
    description: "Charming hill station hotel with WiFi, heating, garden, restaurant, parking, and stunning coffee plantation views. Perfect for nature lovers.",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=600&fit=crop",
    price: 3200,
    location: "Coorg, Karnataka",
    country: "India",
  },
  {
    title: "Heritage Hotel in Mysore",
    description: "Beautiful heritage hotel with WiFi, air conditioning, garden, restaurant, parking, and close to Mysore Palace. Experience royal Karnataka.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
    price: 3000,
    location: "Mysore, Karnataka",
    country: "India",
  },
  {
    title: "Beachfront Resort in Puri",
    description: "Luxury beachfront resort with WiFi, air conditioning, private beach, pool, spa, restaurant, parking, and close to Jagannath Temple.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
    price: 3800,
    location: "Puri, Odisha",
    country: "India",
  },
  {
    title: "Heritage Haveli in Vadodara",
    description: "Beautiful heritage haveli with WiFi, air conditioning, garden, restaurant, parking, and close to Laxmi Vilas Palace. Experience royal Gujarat.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    price: 2800,
    location: "Vadodara, Gujarat",
    country: "India",
  },
  {
    title: "Beach Resort in Diu",
    description: "Luxury beach resort with WiFi, air conditioning, private beach, pool, spa, restaurant, parking, and close to Diu Fort.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    price: 4000,
    location: "Diu, Gujarat",
    country: "India",
  },
  {
    title: "Mountain Resort in Auli",
    description: "Ski resort with WiFi, heating, ski facilities, restaurant, parking, and stunning views of Nanda Devi. Perfect for adventure enthusiasts.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    price: 4000,
    location: "Auli, Uttarakhand",
    country: "India",
  },
  {
    title: "Heritage Palace in Bikaner",
    description: "Royal palace hotel with WiFi, air conditioning, multiple restaurants, spa, pool, parking, and close to Junagarh Fort. Experience royal Rajasthan.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop",
    price: 4500,
    location: "Bikaner, Rajasthan",
    country: "India",
  },
  {
    title: "Hill Station Hotel in Mount Abu",
    description: "Charming hill station hotel with WiFi, heating, garden, restaurant, parking, and close to Dilwara Temples. Perfect for spiritual retreat.",
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&h=600&fit=crop",
    price: 2800,
    location: "Mount Abu, Rajasthan",
    country: "India",
  },
  {
    title: "Beachfront Villa in Alibaug",
    description: "Stunning beachfront villa with WiFi, air conditioning, private pool, fully equipped kitchen, parking, and close to Alibaug Beach. Perfect weekend getaway from Mumbai.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    price: 4200,
    location: "Alibaug, Maharashtra",
    country: "India",
  },
];

module.exports = { data: sampleListings };
