# 🚀 Quick Start Guide - Smart Stay AI Features

## ✅ Integration Complete!

All 4 AI features are now integrated:
1. ✅ Travel Itinerary Generation
2. ✅ Solo Trip Planner  
3. ✅ Smart Chat
4. ✅ NLP Amenity Extraction

---

## 🏃 Quick Start (2 Steps)

### **Step 1: Start FastAPI Server (AI Service)**
```bash
cd "AI Compare"
python3 main.py
```
**Expected output:**
```
🚀 Starting Sigma GPT AI Service...
📍 Server URL: http://localhost:8000
📚 API Docs: http://localhost:8000/docs
💚 Health Check: http://localhost:8000/health
```

### **Step 2: Start Express Server (Your App)**
```bash
# In a new terminal
node app.js
```
**Expected output:**
```
Connected to DB
server is listening on 8080
```

---

## 🧪 Test the Integration

### **1. Test Travel Itinerary**
```bash
curl -X POST http://localhost:8080/api/travel/plan \
  -H "Content-Type: application/json" \
  -d '{"query": "Plan a trip to Goa from Mumbai"}'
```

### **2. Test Amenity Extraction**
```bash
# Extract amenities for all listings
curl -X POST http://localhost:8080/api/listings/bulk-extract-amenities
```

### **3. Test Smart Chat**
```bash
curl -X POST http://localhost:8080/api/chat/smart \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the weather in Mumbai?"}'
```

---

## 📍 Available Endpoints

| Feature | Endpoint | Method |
|---------|----------|--------|
| Travel Itinerary | `/api/travel/plan` | POST |
| Solo Trip Start | `/api/travel/solo/start` | POST |
| Solo Trip Resume | `/api/travel/solo/resume` | POST |
| Smart Chat | `/api/chat/smart` | POST |
| Extract Amenities (Single) | `/api/listings/:id/extract-amenities` | POST |
| Extract Amenities (Bulk) | `/api/listings/bulk-extract-amenities` | POST |

---

## 🎯 Next Steps

1. **Extract amenities for existing listings:**
   ```bash
   curl -X POST http://localhost:8080/api/listings/bulk-extract-amenities
   ```

2. **Add more hotel listings** (50-100 recommended)

3. **Test all features** to ensure everything works

---

## ⚠️ Troubleshooting

### **"Connection refused" error:**
- Make sure FastAPI server is running on port 8000
- Check: `curl http://localhost:8000/health`

### **"Module not found" error:**
- Install Python dependencies: `cd "AI Compare" && pip install -r requirements.txt`

### **"MongoDB connection failed":**
- Make sure MongoDB is running: `mongod` or `brew services start mongodb-community`

---

## ✅ All Set!

Your Smart Stay platform now has all 4 AI features integrated and ready to use! 🎉

