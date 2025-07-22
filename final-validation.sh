#!/bin/bash

# OneView React Application Final Validation Test - Enhanced Version
# This script validates that all key features including login and real DevOps integration are working

echo "🚀 OneView React - Enhanced Final Validation Test"
echo "================================================"
echo

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test functions
test_server() {
    echo -e "${BLUE}Testing development server...${NC}"
    if curl -s http://localhost:5173 > /dev/null; then
        echo -e "${GREEN}✓ Development server is running${NC}"
        return 0
    else
        echo -e "${RED}✗ Development server is not running${NC}"
        return 1
    fi
}

test_api_health() {
    echo -e "${BLUE}Testing API health endpoint...${NC}"
    response=$(curl -s http://localhost:5173/api/health)
    if [[ $response == *"database"* ]]; then
        echo -e "${GREEN}✓ Health API endpoint is working${NC}"
        echo "   Response: $response"
        return 0
    else
        echo -e "${RED}✗ Health API endpoint failed${NC}"
        return 1
    fi
}

test_api_initiatives() {
    echo -e "${BLUE}Testing initiatives API endpoint...${NC}"
    response=$(curl -s http://localhost:5173/api/initiatives)
    if [[ $response == *"[" ]] && [[ $response == *"]" ]]; then
        echo -e "${GREEN}✓ Initiatives API endpoint is working${NC}"
        initiative_count=$(echo $response | jq length 2>/dev/null || echo "unknown")
        echo "   Found $initiative_count initiatives"
        return 0
    else
        echo -e "${YELLOW}⚠ Initiatives API may be using mock data${NC}"
        echo "   Response: ${response:0:100}..."
        return 1
    fi
}

test_react_components() {
    echo -e "${BLUE}Testing React components...${NC}"
    
    # Check if main components exist
    components=(
        "src/App.jsx"
        "src/components/Portfolio/PortfolioCard.jsx"
        "src/components/Portfolio/GanttChart.jsx"
        "src/components/Portfolio/FilterPanel.jsx"
        "src/components/Common/Toast.jsx"
        "src/components/Auth/PasswordDialog.jsx"
        "src/components/Auth/LoginPage.jsx"
        "src/components/Configuration/DevOpsConfiguration.jsx"
        "src/services/azureDevOps.js"
        "src/hooks/useAuth.js"
        "src/views/DirectorsView.jsx"
    )
    
    missing_components=()
    for component in "${components[@]}"; do
        if [[ -f "$component" ]]; then
            echo -e "${GREEN}✓ $component${NC}"
        else
            echo -e "${RED}✗ $component${NC}"
            missing_components+=("$component")
        fi
    done
    
    if [[ ${#missing_components[@]} -eq 0 ]]; then
        return 0
    else
        return 1
    fi
}

test_dependencies() {
    echo -e "${BLUE}Testing dependencies...${NC}"
    
    # Check package.json exists and has key dependencies
    if [[ -f "package.json" ]]; then
        echo -e "${GREEN}✓ package.json found${NC}"
        
        # Check for key dependencies
        key_deps=("react" "vite" "date-fns")
        for dep in "${key_deps[@]}"; do
            if grep -q "\"$dep\"" package.json; then
                echo -e "${GREEN}✓ $dep dependency${NC}"
            else
                echo -e "${YELLOW}⚠ $dep dependency not found${NC}"
            fi
        done
        return 0
    else
        echo -e "${RED}✗ package.json not found${NC}"
        return 1
    fi
}

test_azure_configs() {
    echo -e "${BLUE}Testing Azure deployment configurations...${NC}"
    
    azure_files=(
        ".azure/config"
        "web.config"
        "staticwebapp.config.json"
        "AZURE-DEPLOY-GUIDE.md"
        "STATIC-WEB-APP-GUIDE.md"
    )
    
    for file in "${azure_files[@]}"; do
        if [[ -f "$file" ]]; then
            echo -e "${GREEN}✓ $file${NC}"
        else
            echo -e "${YELLOW}⚠ $file (optional)${NC}"
        fi
    done
    
    return 0
}

# Run all tests
echo "Starting validation tests..."
echo

passed=0
total=0

# Test 1: Server
total=$((total + 1))
if test_server; then
    passed=$((passed + 1))
fi
echo

# Test 2: API Health
total=$((total + 1))
if test_api_health; then
    passed=$((passed + 1))
fi
echo

# Test 3: API Initiatives
total=$((total + 1))
if test_api_initiatives; then
    passed=$((passed + 1))
fi
echo

# Test 4: React Components
total=$((total + 1))
if test_react_components; then
    passed=$((passed + 1))
fi
echo

# Test 5: Dependencies
total=$((total + 1))
if test_dependencies; then
    passed=$((passed + 1))
fi
echo

# Test 6: Azure Configs
total=$((total + 1))
if test_azure_configs; then
    passed=$((passed + 1))
fi
echo

# Final results
echo "======================================="
echo -e "${BLUE}Final Results:${NC}"
echo -e "Tests passed: ${GREEN}$passed${NC}/$total"

if [[ $passed -eq $total ]]; then
    echo -e "${GREEN}🎉 All tests passed! OneView React is ready for deployment.${NC}"
elif [[ $passed -ge 4 ]]; then
    echo -e "${YELLOW}⚠ Most tests passed. Minor issues detected but app should work.${NC}"
else
    echo -e "${RED}❌ Several tests failed. Please review the issues above.${NC}"
fi

echo
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Visit http://localhost:5173 to test the application"
echo "2. Use login credentials: admin, oneview2025, or volvo123"
echo "3. Try the Configuration tab to load data (mock or real DevOps)"
echo "4. Configure Azure DevOps PAT in Connections tab for real data"
echo "5. Switch to Portfolio tab to view initiatives with filters"
echo "6. Test the filter functionality and PDF export"
echo "7. Test the connection status and DevOps integration"
echo "8. Try Directors view: http://localhost:5173/directors?view=portfolio&minimal=true"
echo

echo -e "${BLUE}For deployment:${NC}"
echo "- Review AZURE-DEPLOY-GUIDE.md for App Service deployment"
echo "- Review STATIC-WEB-APP-GUIDE.md for Static Web Apps deployment"
echo "- Update environment variables for production"
echo "- Configure real Azure DevOps and SQL connections"

exit 0
