#!/bin/bash

echo "=== Azure App Service Deployment Script ==="
echo "Starting deployment process..."

# Set up error handling
set -e

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

echo "Installing dependencies..."
npm install

echo "Building React frontend..."
npm run build:frontend

echo "Verifying dist folder..."
if [ ! -d "dist" ]; then
    echo "Error: dist folder was not created during build"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "Error: dist/index.html was not created during build"
    exit 1
fi

echo "Installing API dependencies..."
cd api && npm install && cd ..

echo "Checking server file..."
if [ ! -f "server.js" ]; then
    echo "Error: server.js not found"
    exit 1
fi

echo "=== Deployment completed successfully ==="
echo "Files verified:"
echo "✓ dist/index.html exists"
echo "✓ server.js exists"
echo "✓ Dependencies installed"
echo ""
echo "The application should now be ready for Azure App Service deployment."
