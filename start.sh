#!/bin/bash

# =============================================================================
#                     SMART STAY - STARTUP SCRIPT
# =============================================================================
#
# 🚀 This script starts ALL services for Smart Stay:
#    1. Express (Node.js) - Port 8080
#    2. FastAPI (Python AI) - Port 8000
#
# 📖 HOW TO USE:
#    chmod +x start.sh     # Make executable (only once)
#    ./start.sh            # Start everything
#
# 📌 IMPORTANT: Make sure MongoDB is running before starting!
#    brew services start mongodb-community  (macOS)
#
# =============================================================================

echo "🏨 Starting Smart Stay Services..."
echo "=================================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti :$port 2>/dev/null)
    if [ -n "$pid" ]; then
        echo -e "${YELLOW}⚠️  Killing existing process on port $port (PID: $pid)${NC}"
        kill -9 $pid 2>/dev/null
        sleep 1
    fi
}

# =============================================================================
#                     1. CHECK MONGODB
# =============================================================================

echo ""
echo "📊 Checking MongoDB..."
if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${RED}❌ MongoDB is NOT running!${NC}"
    echo "   Please start MongoDB first:"
    echo "   brew services start mongodb-community"
    exit 1
fi

# =============================================================================
#                     2. SETUP PYTHON VIRTUAL ENVIRONMENT
# =============================================================================

echo ""
echo "🐍 Setting up Python environment..."

AI_DIR="$SCRIPT_DIR/AI"

# Check if venv exists, create if not
if [ ! -d "$AI_DIR/venv" ]; then
    echo "Creating virtual environment..."
    /usr/bin/python3 -m venv "$AI_DIR/venv"
    
    echo "Installing Python dependencies..."
    source "$AI_DIR/venv/bin/activate"
    pip install --upgrade pip > /dev/null 2>&1
    pip install -r "$AI_DIR/requirements.txt" > /dev/null 2>&1
    deactivate
    echo -e "${GREEN}✅ Python environment created and dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Python virtual environment exists${NC}"
fi

# =============================================================================
#                     3. START FASTAPI (Python AI Service)
# =============================================================================

echo ""
echo "🤖 Starting FastAPI (AI Service) on port 8000..."

# Kill any existing process on 8000
kill_port 8000

# Start FastAPI in background
cd "$AI_DIR"
source venv/bin/activate
python main.py > /dev/null 2>&1 &
FASTAPI_PID=$!
deactivate
cd "$SCRIPT_DIR"

# Wait and check if started
sleep 3
if check_port 8000; then
    echo -e "${GREEN}✅ FastAPI running on http://localhost:8000 (PID: $FASTAPI_PID)${NC}"
else
    echo -e "${RED}❌ FastAPI failed to start!${NC}"
    echo "   Check AI/main.py for errors"
fi

# =============================================================================
#                     4. START EXPRESS (Node.js Server)
# =============================================================================

echo ""
echo "🌐 Starting Express (Node.js) on port 8080..."

# Kill any existing process on 8080
kill_port 8080

# Start Express in background
cd "$SCRIPT_DIR"
node app.js > /dev/null 2>&1 &
EXPRESS_PID=$!

# Wait and check if started
sleep 2
if check_port 8080; then
    echo -e "${GREEN}✅ Express running on http://localhost:8080 (PID: $EXPRESS_PID)${NC}"
else
    echo -e "${RED}❌ Express failed to start!${NC}"
    echo "   Check app.js for errors"
fi

# =============================================================================
#                     5. SUMMARY
# =============================================================================

echo ""
echo "=================================="
echo "🏨 Smart Stay Services Status"
echo "=================================="

if check_port 8080; then
    echo -e "${GREEN}✅ Express (Node.js):  http://localhost:8080${NC}"
else
    echo -e "${RED}❌ Express (Node.js):  NOT RUNNING${NC}"
fi

if check_port 8000; then
    echo -e "${GREEN}✅ FastAPI (Python):   http://localhost:8000${NC}"
else
    echo -e "${RED}❌ FastAPI (Python):   NOT RUNNING${NC}"
fi

echo ""
echo "📖 Open in browser: http://localhost:8080"
echo "📖 AI Dashboard:    http://localhost:8080/ai"
echo ""
echo "🛑 To stop services:"
echo "   kill $EXPRESS_PID $FASTAPI_PID"
echo "   OR press Ctrl+C if running in foreground"
echo ""

