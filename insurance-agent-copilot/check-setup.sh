#!/bin/bash

# Insurance Agent Copilot - Setup Checker
# Verifies all prerequisites and configuration

echo "🔍 Insurance Agent Copilot - Setup Checker"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        return 1
    fi
}

check_version() {
    local cmd=$1
    local min_version=$2
    local version=$($cmd --version 2>&1 | grep -oE '[0-9]+\.[0-9]+' | head -1)
    
    if [ -z "$version" ]; then
        echo -e "${YELLOW}⚠${NC} Could not detect $cmd version"
        return 1
    fi
    
    echo -e "${GREEN}✓${NC} $cmd version: $version"
    return 0
}

# 1. Check Node.js
echo "1. Checking Node.js..."
if check_command node; then
    check_version node 20.0
else
    echo -e "${YELLOW}  → Install from: https://nodejs.org/${NC}"
fi
echo ""

# 2. Check Python
echo "2. Checking Python..."
if check_command python3; then
    check_version python3 3.9
else
    echo -e "${YELLOW}  → Install from: https://python.org/${NC}"
fi
echo ""

# 3. Check npm
echo "3. Checking npm..."
check_command npm
echo ""

# 4. Check pip
echo "4. Checking pip..."
check_command pip || check_command pip3
echo ""

# 5. Check .env file
echo "5. Checking .env file..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    
    # Check for required variables
    if grep -q "GEMINI_API_KEY=your_gemini_api_key_here" .env; then
        echo -e "${YELLOW}⚠${NC} GEMINI_API_KEY not configured (still has placeholder)"
        echo -e "${YELLOW}  → Get your key from: https://aistudio.google.com/app/apikey${NC}"
    elif grep -q "GEMINI_API_KEY=" .env; then
        echo -e "${GREEN}✓${NC} GEMINI_API_KEY is configured"
    else
        echo -e "${RED}✗${NC} GEMINI_API_KEY not found in .env"
    fi
    
    if grep -q "VITE_API_URL=" .env; then
        echo -e "${GREEN}✓${NC} VITE_API_URL is configured"
    else
        echo -e "${YELLOW}⚠${NC} VITE_API_URL not found in .env"
    fi
else
    echo -e "${RED}✗${NC} .env file not found"
    echo -e "${YELLOW}  → Run: cp .env.example .env${NC}"
fi
echo ""

# 6. Check node_modules
echo "6. Checking frontend dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
else
    echo -e "${YELLOW}⚠${NC} node_modules not found"
    echo -e "${YELLOW}  → Run: npm install${NC}"
fi
echo ""

# 7. Check Python dependencies
echo "7. Checking backend dependencies..."
if [ -d "backend" ]; then
    echo -e "${GREEN}✓${NC} backend directory exists"
    
    # Try to import fastapi
    if python3 -c "import fastapi" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Python dependencies installed"
    else
        echo -e "${YELLOW}⚠${NC} Python dependencies not installed"
        echo -e "${YELLOW}  → Run: cd backend && pip install -r requirements.txt${NC}"
    fi
else
    echo -e "${RED}✗${NC} backend directory not found"
fi
echo ""

# 8. Check mock data
echo "8. Checking mock data..."
if [ -d "src/data/mock" ]; then
    echo -e "${GREEN}✓${NC} Mock data directory exists"
    
    # Count JSON files
    json_count=$(ls -1 src/data/mock/*.json 2>/dev/null | wc -l)
    if [ $json_count -gt 0 ]; then
        echo -e "${GREEN}✓${NC} Found $json_count mock data files"
    else
        echo -e "${YELLOW}⚠${NC} No mock data files found"
    fi
else
    echo -e "${RED}✗${NC} Mock data directory not found"
fi
echo ""

# Summary
echo "=========================================="
echo "📋 Setup Summary"
echo "=========================================="
echo ""

# Check if everything is ready
all_good=true

if ! command -v node &> /dev/null; then
    all_good=false
fi

if ! command -v python3 &> /dev/null; then
    all_good=false
fi

if [ ! -f ".env" ]; then
    all_good=false
fi

if [ ! -d "node_modules" ]; then
    all_good=false
fi

if $all_good; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "You're ready to start the application:"
    echo ""
    echo "  Terminal 1: npm run server"
    echo "  Terminal 2: npm run dev"
    echo ""
    echo "Then visit: http://localhost:3000"
else
    echo -e "${YELLOW}⚠ Some issues found. Please fix them before starting.${NC}"
    echo ""
    echo "Quick fix commands:"
    echo ""
    echo "  # Install frontend dependencies"
    echo "  npm install"
    echo ""
    echo "  # Install backend dependencies"
    echo "  cd backend && pip install -r requirements.txt && cd .."
    echo ""
    echo "  # Create .env file"
    echo "  cp .env.example .env"
    echo "  # Then edit .env and add your GEMINI_API_KEY"
fi

echo ""
echo "For detailed setup instructions, see:"
echo "  - README.md"
echo "  - QUICKSTART_PYTHON.md"
echo "  - backend/README.md"
echo ""
