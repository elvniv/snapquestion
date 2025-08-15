#!/bin/bash

# SnapQuestion API Test Script
# Comprehensive testing of all API endpoints

echo "🧪 SnapQuestion API Testing"
echo "=========================="
echo ""

API_BASE="http://localhost:8001"
AUTH_HEADER="Authorization: Bearer DEV"
JSON_HEADER="Content-Type: application/json"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test results
PASS=0
FAIL=0

# Helper functions
pass_test() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((PASS++))
}

fail_test() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((FAIL++))
}

warn_test() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
}

test_endpoint() {
    local test_name="$1"
    local curl_cmd="$2"
    local expected_key="$3"
    
    echo -n "Testing $test_name... "
    
    response=$(eval $curl_cmd 2>/dev/null)
    status=$?
    
    if [ $status -eq 0 ]; then
        if [ -n "$expected_key" ]; then
            if echo "$response" | grep -q "\"$expected_key\""; then
                pass_test "$test_name"
                return 0
            else
                fail_test "$test_name (missing key: $expected_key)"
                echo "Response: $response"
                return 1
            fi
        else
            pass_test "$test_name"
            return 0
        fi
    else
        fail_test "$test_name (curl error)"
        return 1
    fi
}

echo "1. Health Check"
echo "--------------"
test_endpoint "Health endpoint" \
    "curl -s $API_BASE/healthz" \
    "ok"

echo ""
echo "2. Authentication Tests"
echo "----------------------"
# Test without auth
response=$(curl -s -X POST -H "$JSON_HEADER" -d '{"tenant_id":"test","query_text":"test"}' $API_BASE/v1/answer)
if echo "$response" | grep -q "Missing or invalid authorization header"; then
    pass_test "Unauthorized request blocked"
else
    fail_test "Unauthorized request not blocked"
    echo "Response: $response"
fi

# Test with valid auth
test_endpoint "Valid authorization" \
    "curl -s -H '$AUTH_HEADER' -H '$JSON_HEADER' -d '{\"tenant_id\":\"dev-tenant\",\"query_text\":\"test\"}' $API_BASE/v1/answer" \
    "answer"

echo ""
echo "3. Answer Endpoint Tests"
echo "-----------------------"
test_endpoint "Basic question" \
    "curl -s -H '$AUTH_HEADER' -H '$JSON_HEADER' -d '{\"tenant_id\":\"dev-tenant\",\"query_text\":\"How do I reset the filter?\"}' $API_BASE/v1/answer" \
    "confidence"

test_endpoint "Complex question (escalation)" \
    "curl -s -H '$AUTH_HEADER' -H '$JSON_HEADER' -d '{\"tenant_id\":\"dev-tenant\",\"query_text\":\"This is a complex electrical issue\"}' $API_BASE/v1/answer" \
    "escalated"

echo ""
echo "4. File Upload Tests"
echo "-------------------"
# Create test file
echo "Test manual content for HVAC filter replacement instructions." > /tmp/test-doc.txt

test_endpoint "Document upload" \
    "curl -s -H '$AUTH_HEADER' -F 'file=@/tmp/test-doc.txt' '$API_BASE/v1/ingest/upload?tenant_id=dev-tenant'" \
    "source_id"

# Test upload without auth
response=$(curl -s -F "file=@/tmp/test-doc.txt" "$API_BASE/v1/ingest/upload?tenant_id=dev-tenant")
if echo "$response" | grep -q "Missing or invalid authorization header"; then
    pass_test "Upload without auth blocked"
else
    fail_test "Upload without auth not blocked"
fi

# Clean up test file
rm -f /tmp/test-doc.txt

echo ""
echo "5. Billing Endpoint Tests"
echo "------------------------"
test_endpoint "Checkout session creation" \
    "curl -s -H '$AUTH_HEADER' -H '$JSON_HEADER' -d '{\"tenant_id\":\"dev-tenant\",\"plan\":\"pro\"}' $API_BASE/v1/billing/checkout" \
    "checkout_url"

echo ""
echo "6. Tenant Stats Tests"
echo "--------------------"
test_endpoint "Tenant statistics" \
    "curl -s -H '$AUTH_HEADER' $API_BASE/v1/tenants/dev-tenant/stats" \
    "total_queries"

echo ""
echo "7. CORS and Headers"
echo "------------------"
# Test CORS preflight
cors_response=$(curl -s -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Authorization,Content-Type" -X OPTIONS $API_BASE/v1/answer)
if [ "$cors_response" = "OK" ]; then
    pass_test "CORS preflight request"
else
    fail_test "CORS preflight request"
    echo "Response: $cors_response"
fi

echo ""
echo "8. Error Handling Tests"
echo "----------------------"
# Test malformed JSON
response=$(curl -s -H "$AUTH_HEADER" -H "$JSON_HEADER" -d '{"invalid":json"}' $API_BASE/v1/answer)
if echo "$response" | grep -q "detail"; then
    pass_test "Malformed JSON handled"
else
    fail_test "Malformed JSON not handled properly"
fi

# Test missing required fields
response=$(curl -s -H "$AUTH_HEADER" -H "$JSON_HEADER" -d '{"query_text":"test"}' $API_BASE/v1/answer)
if echo "$response" | grep -q "Field required"; then
    pass_test "Missing required fields validated"
else
    fail_test "Missing required fields not validated"
fi

echo ""
echo "=========================="
echo "📊 Test Summary"
echo "=========================="
echo -e "Total tests run: $((PASS + FAIL))"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"

if [ $FAIL -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! API is working correctly.${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Check the output above for details.${NC}"
    exit 1
fi