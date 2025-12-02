#!/bin/bash

# Run All Services Script
# This script runs both the frontend (Vite) and backend (.NET API) services
# If one project is not found, it will log and run the one that exists

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$(dirname "$FRONTEND_DIR")/Round"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Round Dashboard - Service Runner${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check what's available
FRONTEND_AVAILABLE=false
BACKEND_AVAILABLE=false

if [ -f "$FRONTEND_DIR/package.json" ]; then
    FRONTEND_AVAILABLE=true
    echo -e "${GREEN}✓ Frontend found:${NC} $FRONTEND_DIR"
else
    echo -e "${YELLOW}⚠ Frontend not found:${NC} $FRONTEND_DIR"
fi

if [ -f "$BACKEND_DIR/Round.sln" ]; then
    BACKEND_AVAILABLE=true
    echo -e "${GREEN}✓ Backend found:${NC} $BACKEND_DIR"
else
    echo -e "${YELLOW}⚠ Backend not found:${NC} $BACKEND_DIR"
fi

echo ""

# Exit if nothing is available
if [ "$FRONTEND_AVAILABLE" = false ] && [ "$BACKEND_AVAILABLE" = false ]; then
    echo -e "${RED}✗ No projects found. Exiting.${NC}"
    exit 1
fi

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start services
if [ "$BACKEND_AVAILABLE" = true ]; then
    echo -e "${BLUE}Starting backend (.NET API)...${NC}"
    cd "$BACKEND_DIR"
    dotnet run --project src/Round.Application/Round.Application.csproj &
    BACKEND_PID=$!
    echo -e "${GREEN}Backend started with PID: $BACKEND_PID${NC}"
fi

if [ "$FRONTEND_AVAILABLE" = true ]; then
    echo -e "${BLUE}Starting frontend (Vite)...${NC}"
    cd "$FRONTEND_DIR"
    npm run dev &
    FRONTEND_PID=$!
    echo -e "${GREEN}Frontend started with PID: $FRONTEND_PID${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Services are running!${NC}"
echo -e "${GREEN}========================================${NC}"

if [ "$FRONTEND_AVAILABLE" = true ]; then
    echo -e "   Frontend: ${BLUE}http://localhost:5173${NC}"
fi

if [ "$BACKEND_AVAILABLE" = true ]; then
    echo -e "   Backend:  ${BLUE}http://localhost:5000${NC}"
fi

echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for all background processes
wait
