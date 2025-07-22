#!/bin/bash

# OneView React - GitHub Repository Setup
# This script helps set up the GitHub repository for the OneView React project

echo "🚀 Setting up OneView React GitHub Repository..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Error: Please run this script from the OneView React project root directory"
    exit 1
fi

echo "📋 Current project status:"
echo "   • Project: OneView React"
echo "   • Location: $(pwd)"
echo "   • Branch: $(git branch --show-current 2>/dev/null || echo 'Not a git repository')"
echo ""

# Verify git status
if git status >/dev/null 2>&1; then
    echo "✅ Git repository detected"
    
    # Show current status
    echo ""
    echo "📊 Current Git Status:"
    git status --short
    echo ""
    
    # Check for uncommitted changes
    if ! git diff --quiet || ! git diff --cached --quiet; then
        echo "⚠️  You have uncommitted changes. Would you like to commit them first? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "feat: Final Volvo UX/UI implementation ready for GitHub deployment"
            echo "✅ Changes committed"
        fi
    fi
else
    echo "❌ Error: This is not a git repository"
    echo "   Run: git init"
    exit 1
fi

echo ""
echo "🎯 Next steps to create the GitHub repository:"
echo ""
echo "1. Go to GitHub.com and create a new repository:"
echo "   • Repository name: oneview-react"
echo "   • Description: OneView React - Executive Portfolio Dashboard with Volvo UX/UI"
echo "   • Make it public or private as needed"
echo "   • Don't initialize with README (we already have one)"
echo ""
echo "2. After creating the repository, run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/oneview-react.git"
echo "   git push -u origin main"
echo ""
echo "3. Or if you want to use SSH:"
echo "   git remote add origin git@github.com:YOUR_USERNAME/oneview-react.git"
echo "   git push -u origin main"
echo ""

# Show current remotes
echo "📡 Current git remotes:"
git remote -v 2>/dev/null || echo "   No remotes configured"
echo ""

echo "🔧 Project Features Ready for Deployment:"
echo "   ✅ Complete Volvo UX/UI design system"
echo "   ✅ Custom VolvoIcon component with SVG icons"
echo "   ✅ Official Volvo fonts and colors applied"
echo "   ✅ Black backgrounds and icons removed"
echo "   ✅ DirectorsView with executive branding"
echo "   ✅ Azure deployment configuration"
echo "   ✅ Static Web Apps compatibility"
echo "   ✅ DevOps and SQL integration"
echo "   ✅ Authentication and role-based access"
echo ""

echo "🎨 Volvo Brand Implementation:"
echo "   • Volvo Sans font family"
echo "   • Official Volvo blue color palette"
echo "   • Custom SVG icons replacing FontAwesome"
echo "   • Brand-consistent spacing and typography"
echo "   • Executive dashboard styling"
echo ""

echo "📁 Repository Structure Ready:"
ls -la | head -20
echo ""

echo "🚀 Ready for GitHub! Create your repository and push the code."
echo ""
