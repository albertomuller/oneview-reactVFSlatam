#!/bin/bash

# Azure App Service startup script for Node.js + React (Vite) app
echo "Starting Azure deployment..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Working directory: $(pwd)"

# Set npm cache directory and optimize settings
export npm_config_cache=/tmp/.npm
export npm_config_prefer_offline=true
export npm_config_audit=false
export npm_config_fund=false

# Build the React frontend if not exists
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    echo "Building React frontend..."
    npm run build:frontend || {
        echo "Frontend build failed, trying again..."
        npm run build:frontend
    }
else
    echo "Frontend already built, skipping build"
fi

# Install/check API dependencies
echo "Checking API dependencies..."
cd api
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo "Installing API dependencies..."
    npm install --omit=dev --no-audit --no-fund --prefer-offline
else
    echo "API dependencies already installed"
fi
cd ..

# Start the server
echo "Starting Node.js server on port ${PORT:-8080}..."
exec node server.js
