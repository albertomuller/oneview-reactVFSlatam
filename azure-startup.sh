#!/bin/bash

echo "=== Azure Startup Script ==="
echo "Starting at: $(date)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Working directory: $(pwd)"

# Set npm configuration for faster installs
export NPM_CONFIG_CACHE=/tmp/.npm
export NPM_CONFIG_PREFER_OFFLINE=true
export NPM_CONFIG_AUDIT=false
export NPM_CONFIG_FUND=false
export NPM_CONFIG_PROGRESS=false

# Check if dist directory exists (frontend already built)
if [ ! -d "dist" ]; then
    echo "Frontend not built, building now..."
    npm run build:frontend || {
        echo "Frontend build failed, trying with verbose logging..."
        npm run build:frontend --verbose
    }
else
    echo "Frontend already built, skipping build step"
fi

# Check if API dependencies are installed
if [ ! -d "api/node_modules" ]; then
    echo "Installing API dependencies..."
    cd api
    npm ci --production --no-audit --no-fund --prefer-offline 2>/dev/null || npm install --production --no-audit --no-fund --prefer-offline
    cd ..
else
    echo "API dependencies already installed"
fi

echo "Starting Node.js server..."
exec node server.js
