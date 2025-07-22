#!/bin/bash

# Azure App Service startup script for Node.js + React (Vite) app
echo "Starting Azure deployment..."

# Set npm cache directory
export npm_config_cache=/tmp/.npm

# Install production dependencies with fallback
echo "Installing dependencies..."
if npm ci --omit=dev --no-audit --no-fund --prefer-offline 2>/dev/null; then
    echo "✅ npm ci succeeded"
else
    echo "⚠️ npm ci failed, falling back to npm install"
    npm install --omit=dev --no-audit --no-fund --prefer-offline
fi

# Build the React frontend
echo "Building React frontend..."
npm run build:frontend

# Install API dependencies with fallback
echo "Installing API dependencies..."
cd api
if npm ci --omit=dev --no-audit --no-fund --prefer-offline 2>/dev/null; then
    echo "✅ API npm ci succeeded"
else
    echo "⚠️ API npm ci failed, falling back to npm install"
    npm install --omit=dev --no-audit --no-fund --prefer-offline
fi
cd ..

# Start the server
echo "Starting server..."
exec node server.js
