#!/bin/bash

# GitHub Repository Setup Script for Volvo OneView React
# This script helps set up a new GitHub repository and push the project

set -e

echo "🚀 Volvo OneView React - GitHub Repository Setup"
echo "================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check for GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Please install it from: https://cli.github.com/"
    echo "   Or create repository manually at: https://github.com/new"
    MANUAL_SETUP=true
else
    echo "✅ GitHub CLI found"
    MANUAL_SETUP=false
fi

# Get repository details
read -p "📝 Enter GitHub username/organization: " GITHUB_USER
read -p "📝 Enter repository name [oneview-react]: " REPO_NAME
REPO_NAME=${REPO_NAME:-oneview-react}

read -p "📝 Repository description [Volvo OneView React - Strategic Portfolio Management System]: " REPO_DESC
REPO_DESC=${REPO_DESC:-"Volvo OneView React - Strategic Portfolio Management System"}

read -p "🔒 Make repository private? (y/N): " PRIVATE
PRIVATE=${PRIVATE:-N}

# Set up .gitignore if not exists
if [ ! -f ".gitignore" ]; then
    echo "📄 Creating .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
.npm
.yarn
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
local.settings.json
.azure/

# Build output
dist/
build/
.next/
out/

# Runtime data
pids
*.pid
*.seed
*.pid.lock
.nyc_output

# Coverage directory used by tools like istanbul
coverage/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# IDE files
.vscode/settings.json
.vscode/launch.json
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Azure deployment
.azure/
web.config

# Local development
server-simple.js
test-app.sh
final-validation.sh
ENHANCED-IMPLEMENTATION-COMPLETE.md
IMPLEMENTATION-COMPLETE.md
DEPLOYMENT-SUMMARY.md
EOF
    echo "✅ .gitignore created"
fi

# Create initial commit structure
echo "📦 Preparing initial commit..."

# Add all files except sensitive ones
git add -A

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Create initial commit
    git commit -m "🎉 Initial commit - Volvo OneView React

✨ Features:
- Modern React 19.1.0 with Vite
- Role-based authentication system
- Azure DevOps integration
- Interactive Gantt charts
- Portfolio management dashboard
- Azure SQL Database backend
- Responsive design with Tailwind CSS
- Executive and Directors views
- Real-time data synchronization

🚀 Ready for Azure deployment with App Service and Static Web Apps support"

    echo "✅ Initial commit created"
fi

# Create repository on GitHub (if CLI available)
if [ "$MANUAL_SETUP" = false ]; then
    echo "🌐 Creating GitHub repository..."
    
    VISIBILITY_FLAG=""
    if [[ "$PRIVATE" =~ ^[Yy]$ ]]; then
        VISIBILITY_FLAG="--private"
    else
        VISIBILITY_FLAG="--public"
    fi
    
    if gh repo create "$GITHUB_USER/$REPO_NAME" --description "$REPO_DESC" $VISIBILITY_FLAG --source=. --remote=origin --push; then
        echo "✅ Repository created and code pushed!"
        echo "🌐 Repository URL: https://github.com/$GITHUB_USER/$REPO_NAME"
    else
        echo "❌ Failed to create repository via GitHub CLI"
        MANUAL_SETUP=true
    fi
fi

# Manual setup instructions
if [ "$MANUAL_SETUP" = true ]; then
    echo ""
    echo "📋 Manual Setup Instructions:"
    echo "=============================="
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: $REPO_DESC"
    echo "4. Choose Public or Private as needed"
    echo "5. DO NOT initialize with README, .gitignore, or license"
    echo "6. Click 'Create repository'"
    echo ""
    echo "7. Then run these commands:"
    echo "   git branch -M main"
    echo "   git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git"
    echo "   git push -u origin main"
fi

# Development setup verification
echo ""
echo "🔧 Development Setup Verification:"
echo "=================================="

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found - required for development"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found"
fi

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    echo "✅ Dependencies already installed"
else
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

# Show next steps
echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Configure environment variables:"
echo "   - Copy .env.example to .env"
echo "   - Add your Azure DevOps PAT and SQL credentials"
echo ""
echo "2. Start development:"
echo "   - npm run dev    (Frontend on port 5173)"
echo "   - npm run api    (Backend on port 3000)"
echo ""
echo "3. Deploy to Azure:"
echo "   - Follow AZURE-DEPLOY-GUIDE.md for App Service"
echo "   - Follow STATIC-WEB-APP-GUIDE.md for Static Web Apps"
echo ""
echo "4. Configure Azure DevOps integration:"
echo "   - Generate PAT with Work Items and Analytics permissions"
echo "   - Use Configuration tab in the app to set up connection"
echo ""
echo "🌟 Your Volvo OneView React project is ready!"

# Show repository information
if [ "$MANUAL_SETUP" = false ]; then
    echo ""
    echo "📊 Repository Information:"
    echo "========================="
    echo "Repository: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo "Clone URL: git clone https://github.com/$GITHUB_USER/$REPO_NAME.git"
    echo ""
    echo "🔧 Quick Deploy to Azure:"
    echo "[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2F$GITHUB_USER%2F$REPO_NAME%2Fmain%2Fazure-deploy-template.json)"
fi

echo ""
echo "✅ Setup completed successfully!"
