#!/bin/bash

# AI Last-Mile Delivery Optimizer - Start Script
# This script cleans ports, sets up the database, seeds data, and starts both backend and frontend

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🚚 AI Last-Mile Delivery Optimizer             ║${NC}"
echo -e "${CYAN}║   Starting Application...                        ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================
# Step 1: Clean up used ports
# ============================================================
echo -e "${YELLOW}[1/6] Cleaning up ports 3000 and 3001...${NC}"

cleanup_port() {
    local port=$1
    local pids=$(lsof -ti :$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo -e "${RED}  Killing processes on port $port: $pids${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 1
    else
        echo -e "${GREEN}  Port $port is free${NC}"
    fi
}

cleanup_port 3000
cleanup_port 3001

# ============================================================
# Step 2: Check PostgreSQL
# ============================================================
echo -e "${YELLOW}[2/6] Checking PostgreSQL...${NC}"

if command -v pg_isready &> /dev/null; then
    if pg_isready -q 2>/dev/null; then
        echo -e "${GREEN}  PostgreSQL is running${NC}"
    else
        echo -e "${RED}  PostgreSQL is not running. Attempting to start...${NC}"
        if command -v brew &> /dev/null; then
            brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null || true
            sleep 2
        fi
    fi
else
    echo -e "${YELLOW}  pg_isready not found, assuming PostgreSQL is running${NC}"
fi

# Create database if it doesn't exist
echo -e "${BLUE}  Creating database 'lastmile_delivery' if not exists...${NC}"
createdb lastmile_delivery 2>/dev/null || echo -e "${GREEN}  Database already exists${NC}"

# ============================================================
# Step 3: Install backend dependencies
# ============================================================
echo -e "${YELLOW}[3/6] Installing backend dependencies...${NC}"
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    npm install --silent 2>&1 | tail -1
else
    echo -e "${GREEN}  Backend dependencies already installed${NC}"
fi

# ============================================================
# Step 4: Install frontend dependencies
# ============================================================
echo -e "${YELLOW}[4/6] Installing frontend dependencies...${NC}"
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    npm install --silent 2>&1 | tail -1
else
    echo -e "${GREEN}  Frontend dependencies already installed${NC}"
fi

# ============================================================
# Step 5: Seed database
# ============================================================
echo -e "${YELLOW}[5/6] Seeding database with sample data...${NC}"
cd "$BACKEND_DIR"
node seeds/seed.js
echo -e "${GREEN}  Database seeded successfully!${NC}"

# ============================================================
# Step 6: Start application with hot reload
# ============================================================
echo -e "${YELLOW}[6/6] Starting application with hot reload...${NC}"
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Application Starting!                          ║${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}║   Backend:  http://localhost:3001                 ║${NC}"
echo -e "${GREEN}║   Frontend: http://localhost:3000                 ║${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}║   Login: admin@lastmile.com / password123        ║${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}║   Press Ctrl+C to stop all services              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# Trap to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    kill $(jobs -p) 2>/dev/null || true
    wait 2>/dev/null || true
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start backend with nodemon for hot reload
cd "$BACKEND_DIR"
npx nodemon server.js &
BACKEND_PID=$!

# Start frontend (React has built-in hot reload)
cd "$FRONTEND_DIR"
BROWSER=none PORT=3000 npm start &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
