#!/bin/bash

# Insurance Agent Copilot - Unified Startup Script
# Starts all servers: Backend API, Whisper Server, and Frontend

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "\n${BLUE}============================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Cleanup function
cleanup() {
    print_header "Shutting Down"
    
    if [ ! -z "$BACKEND_PID" ]; then
        print_info "Stopping Backend API (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
        print_success "Backend API stopped"
    fi
    
    if [ ! -z "$WHISPER_PID" ]; then
        print_info "Stopping Whisper Server (PID: $WHISPER_PID)..."
        kill $WHISPER_PID 2>/dev/null
        print_success "Whisper Server stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        print_info "Stopping Frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null
        print_success "Frontend stopped"
    fi
    
    print_success "All services stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Check if port is in use
check_port() {
    lsof -i:$1 >/dev/null 2>&1
    return $?
}

# Kill process on port
kill_port() {
    print_warning "Killing process on port $1..."
    lsof -ti:$1 | xargs kill -9 2>/dev/null
    sleep 1
}

print_header "Insurance Agent Copilot Startup"

# Check ports
print_info "Checking ports..."

if check_port 5000; then
    print_warning "Port 5000 (Backend API) is in use"
    kill_port 5000
fi

if check_port 5001; then
    print_warning "Port 5001 (Whisper Server) is in use"
    kill_port 5001
fi

if check_port 3000; then
    print_warning "Port 3000 (Frontend) is in use"
    kill_port 3000
fi

print_success "All ports available"

# Start Backend API
print_header "Starting Backend API (Port 5000)"
python backend/main.py > backend.log 2>&1 &
BACKEND_PID=$!
print_success "Backend API starting (PID: $BACKEND_PID)..."
sleep 3

if ! ps -p $BACKEND_PID > /dev/null; then
    print_error "Backend API failed to start"
    cat backend.log
    exit 1
fi
print_success "Backend API running on http://localhost:5000"

# Start Whisper Server
print_header "Starting Whisper Server (Port 5001)"
python backend/whisper_server.py > whisper.log 2>&1 &
WHISPER_PID=$!
print_success "Whisper Server starting (PID: $WHISPER_PID)..."
print_info "Loading Whisper model (this may take a moment)..."
sleep 5

if ! ps -p $WHISPER_PID > /dev/null; then
    print_error "Whisper Server failed to start"
    cat whisper.log
    exit 1
fi
print_success "Whisper Server running on http://localhost:5001"

# Start Frontend
print_header "Starting Frontend (Port 3000)"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Running npm install..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "npm install failed"
        cleanup
        exit 1
    fi
    print_success "Dependencies installed"
fi

npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
print_success "Frontend starting (PID: $FRONTEND_PID)..."
sleep 5

if ! ps -p $FRONTEND_PID > /dev/null; then
    print_error "Frontend failed to start"
    cat frontend.log
    cleanup
    exit 1
fi
print_success "Frontend running on http://localhost:3000"

# All services started
print_header "All Services Running!"
print_success "Backend API:     http://localhost:5000"
print_success "Whisper Server:  http://localhost:5001"
print_success "Frontend:        http://localhost:3000"
echo ""
print_info "Logs:"
print_info "  Backend:  backend.log"
print_info "  Whisper:  whisper.log"
print_info "  Frontend: frontend.log"
echo ""
print_info "Press Ctrl+C to stop all services"
echo ""

# Wait for user interrupt
wait
