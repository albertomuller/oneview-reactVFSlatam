#!/bin/bash

# Azure App Service deployment script for OneView React
echo "Starting OneView deployment..."

# Set error handling
set -e

# Set Node.js version
echo "Setting Node.js version..."
export NODE_VERSION=20

# Install dependencies for frontend
echo "Installing frontend dependencies..."
npm install

# Build the React application with Vite
echo "Building React application with Vite..."
npx vite build

# Verify dist folder was created
if [ ! -d "dist" ]; then
    echo "Error: dist folder was not created during build"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "Error: dist/index.html was not created during build"
    exit 1
fi

echo "Frontend build successful - dist/index.html created"

# Install dependencies for API
echo "Installing API dependencies..."
cd api
npm install
cd ..

echo "Deployment completed successfully!"
echo "Server entry point: server.js"
echo "Static files location: dist/"

# Verify server file exists
if [ ! -f "server.js" ]; then
    echo "Warning: server.js not found in root directory"
fi

echo "OneView React deployment completed!"
