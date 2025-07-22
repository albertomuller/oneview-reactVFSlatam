#!/bin/bash

# GitHub Repository Setup Script for OneView React
echo "🚀 Setting up GitHub repository for OneView React..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Get repository URL from user
echo ""
echo "📝 Please enter your GitHub repository URL:"
echo "   Format: https://github.com/YOUR_USERNAME/oneview-react.git"
read -p "Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Repository URL is required."
    exit 1
fi

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📁 Creating .gitignore file..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
api/node_modules/
.pnp
.pnp.js

# Production builds
/dist
/build

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
local.settings.json

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea
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

# Azure Functions
bin/
obj/
.azure/
EOF
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit - OneView React App with Azure deployment setup

- React frontend with OneView components
- Node.js API with Azure SQL integration  
- GitHub Actions workflow for Azure deployment
- Azure configuration files
- Documentation and deployment guides"

# Add remote origin
echo "🔗 Adding remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Go to your GitHub repository: ${REPO_URL%%.git}"
echo "   2. Go to Settings → Secrets and variables → Actions"
echo "   3. Add secret: AZUREAPPSERVICE_PUBLISHPROFILE_SECRETNAME"
echo "   4. Paste your Azure Web App publish profile as the value"
echo "   5. Push a change to main branch to trigger deployment"
echo ""
echo "📖 For detailed setup instructions, see:"
echo "   - GITHUB-ACTIONS-SETUP.md"
echo "   - AZURE-DEPLOY-GUIDE.md"
echo ""
