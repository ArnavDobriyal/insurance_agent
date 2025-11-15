#!/bin/bash

# Test Backend API
# Quick script to verify all endpoints are working

echo "🧪 Testing Insurance Agent Copilot Backend"
echo "=========================================="
echo ""

BASE_URL="http://localhost:5000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -n "Testing: $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
        echo "  Response: $body"
        return 1
    fi
}

# Check if server is running
echo "Checking if backend is running..."
if curl -s "$BASE_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend is running"
    echo ""
else
    echo -e "${RED}✗${NC} Backend is not running"
    echo ""
    echo "Please start the backend first:"
    echo "  npm run server"
    echo ""
    exit 1
fi

# Run tests
passed=0
failed=0

# Health check
if test_endpoint "GET" "/health" "" "Health check"; then
    ((passed++))
else
    ((failed++))
fi

# Root endpoint
if test_endpoint "GET" "/" "" "Root endpoint"; then
    ((passed++))
else
    ((failed++))
fi

# AI - Intent extraction
if test_endpoint "POST" "/api/ai/intent" '{"text":"Show me hot leads"}' "AI Intent extraction"; then
    ((passed++))
else
    ((failed++))
fi

# Compliance validation
if test_endpoint "POST" "/api/compliance/validate" '{"content":"This is a safe message","type":"message"}' "Compliance validation"; then
    ((passed++))
else
    ((failed++))
fi

# Get leads
if test_endpoint "GET" "/api/leads?limit=5" "" "Get leads"; then
    ((passed++))
else
    ((failed++))
fi

# Get templates
if test_endpoint "GET" "/api/templates" "" "Get templates"; then
    ((passed++))
else
    ((failed++))
fi

# Summary
echo ""
echo "=========================================="
echo "📊 Test Results"
echo "=========================================="
echo ""
echo -e "Passed: ${GREEN}$passed${NC}"
echo -e "Failed: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Backend is working correctly. You can now:"
    echo "  1. View API docs: http://localhost:5000/docs"
    echo "  2. Start frontend: npm run dev"
    echo "  3. Open app: http://localhost:3000"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed${NC}"
    echo ""
    echo "Check the backend logs for errors."
    echo "Make sure:"
    echo "  - Backend is running (npm run server)"
    echo "  - .env file is configured"
    echo "  - GEMINI_API_KEY is set (for AI features)"
    exit 1
fi
