#!/bin/bash

# OneView React Application Test Script
echo "🧪 Testing OneView React Application..."
echo ""

# Test React Dev Server
echo "📱 Testing React Dev Server (port 5178)..."
REACT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5178)
if [ "$REACT_RESPONSE" = "200" ]; then
    echo "✅ React Dev Server: OK"
else
    echo "❌ React Dev Server: Failed (HTTP $REACT_RESPONSE)"
fi

# Test API Server
echo "🔧 Testing API Server (port 7071)..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:7071/api/health)
if [ "$API_RESPONSE" = "200" ]; then
    echo "✅ API Server: OK"
else
    echo "❌ API Server: Failed (HTTP $API_RESPONSE)"
fi

# Test API Proxy through React
echo "🔄 Testing API Proxy through React..."
PROXY_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5178/api/health)
if [ "$PROXY_RESPONSE" = "200" ]; then
    echo "✅ API Proxy: OK"
else
    echo "❌ API Proxy: Failed (HTTP $PROXY_RESPONSE)"
fi

# Test Initiatives Endpoint
echo "📊 Testing Initiatives Endpoint..."
INITIATIVES_RESPONSE=$(curl -s http://localhost:5178/api/initiatives)
INITIATIVES_COUNT=$(echo "$INITIATIVES_RESPONSE" | jq length 2>/dev/null || echo "0")
if [ "$INITIATIVES_COUNT" -gt "0" ]; then
    echo "✅ Initiatives API: OK ($INITIATIVES_COUNT initiatives loaded)"
    echo "   Sample initiative: $(echo "$INITIATIVES_RESPONSE" | jq -r '.[0].market' 2>/dev/null || echo "Data available")"
else
    echo "❌ Initiatives API: No data or failed"
fi

# Test Dependencies
echo "📦 Testing Dependencies..."
if [ -d "node_modules/date-fns" ]; then
    echo "✅ date-fns: Installed"
else
    echo "❌ date-fns: Missing"
fi

if [ -d "node_modules/@fortawesome" ]; then
    echo "✅ FontAwesome: Installed"
else
    echo "❌ FontAwesome: Missing"
fi

echo ""
echo "🌐 Application URLs:"
echo "   React App: http://localhost:5178"
echo "   API Server: http://localhost:7071"
echo ""
echo "📋 Application Status:"
if [ "$REACT_RESPONSE" = "200" ] && [ "$API_RESPONSE" = "200" ] && [ "$PROXY_RESPONSE" = "200" ]; then
    echo "✅ All systems operational! Ready for GitHub deployment."
else
    echo "⚠️  Some issues detected. Check the output above."
fi
echo ""
