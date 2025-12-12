# 🏨 Smart Stay - AI-Powered Hotel Booking Platform

A full-stack hotel booking application with integrated AI features for travel planning, powered by LangGraph and OpenAI.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **Python 3.9+**
- **MongoDB** (running locally or connection string)
- **API Keys** (see Setup below)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Smart-Stay
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Set up Python environment**
   ```bash
   cd AI
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `AI/` directory with your API keys:
   ```bash
   # AI/.env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   TAVILY_API_KEY=tvly-your-tavily-api-key-here  # Optional but recommended
   EXA_API_KEY=your-exa-api-key-here  # Optional
   MONGODB_URI=mongodb://localhost:27017/smartstay
   ```
   
   **Get API Keys:**
   - OpenAI: https://platform.openai.com/api-keys
   - Tavily: https://tavily.com/ (free tier available)
   - Exa: https://docs.exa.ai/ (optional)

5. **Start MongoDB** (if running locally)
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

6. **Start the application**
   ```bash
   # Make startup script executable (first time only)
   chmod +x start.sh
   
   # Start all services
   ./start.sh
   
   # Or manually:
   # Terminal 1: Start FastAPI
   cd AI && source venv/bin/activate && python main.py
   
   # Terminal 2: Start Express
   node app.js
   ```

**Access the app:** http://localhost:8080

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](docs/QUICK_START.md) | Setup instructions |
| [RESUME_CONTENT.md](docs/RESUME_CONTENT.md) | Interview talking points |
| **[Interview/](Interview/)** | **📖 Complete interview prep notes (12 files)** |
| [Interview/READING_ORDER.md](Interview/READING_ORDER.md) | Start here - reading guide |

---

## ✨ Features

### Core Features
- 🏠 **Hotel Listings** - Browse, search, and filter hotels
- ➕ **CRUD Operations** - Create, Read, Update, Delete listings
- 🖼️ **Image Support** - Beautiful hotel images
- 💰 **Indian Pricing** - Prices in ₹ with proper formatting

### AI Features
- 🗺️ **Travel Planner** - 8-node LangGraph workflow for complete itineraries
- 🎒 **Solo Trip Planner** - 11-node Human-in-the-Loop workflow
- 💬 **Smart Chat** - AI assistant with web search capabilities
- 🔍 **Hotel Finder** - Natural language hotel search
- 🏷️ **NLP Amenity Extraction** - Auto-extract amenities from descriptions

---

## 🏗️ Tech Stack

### Backend
- **Node.js + Express** - Main server (port 8080)
- **MongoDB + Mongoose** - Database
- **Python + FastAPI** - AI service (port 8000)

### AI
- **LangGraph** - Workflow orchestration
- **OpenAI GPT-4** - Language model
- **Tavily** - Web search
- **Whisper** - Speech-to-text

### Frontend
- **EJS + EJS-Mate** - Templating
- **Bootstrap 5** - UI framework
- **Custom CSS** - Styling

---

## 📁 Project Structure

```
Smart Stay/
├── app.js              # Express server entry point
├── models/             # Mongoose schemas
├── routes/             # Express routes
├── views/              # EJS templates
│   ├── layouts/        # Base layouts
│   ├── listings/       # Hotel CRUD pages
│   └── ai/             # AI feature pages
├── public/             # Static assets (CSS, JS)
├── AI/                 # Python FastAPI service
│   ├── main.py         # FastAPI entry
│   ├── travel_graph.py # Travel planning workflow
│   └── solo_trip_graph.py # HITL workflow
├── init/               # Database seeding
├── docs/               # Documentation
├── Interview/          # 📖 Interview prep notes (12 files)
│   └── READING_ORDER.md # Start here!
└── start.sh            # Startup script
```

---

## 🎯 For Interviews

**📖 Complete Interview Prep:** See the **[Interview/](Interview/)** folder with 12 detailed notes!

Start with **[Interview/READING_ORDER.md](Interview/READING_ORDER.md)** for the recommended reading order.

**Main concepts to highlight:**
1. Microservices architecture (Express ↔ FastAPI)
2. LangGraph multi-node workflows
3. Human-in-the-Loop (HITL) pattern
4. RESTful API design
5. MongoDB with Mongoose

**Quick Resources:**
- [Interview/InterviewQuestions.txt](Interview/InterviewQuestions.txt) - All Q&A
- [Interview/LangGraphNotes.txt](Interview/LangGraphNotes.txt) - AI workflows
- [docs/RESUME_CONTENT.md](docs/RESUME_CONTENT.md) - Resume bullet points

---

## 📝 License

This project was built for educational purposes.

---

**Happy Coding! 🚀**

