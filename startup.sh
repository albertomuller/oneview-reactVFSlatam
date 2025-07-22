#!/bin/bash

# Azure App Service startup script for Node.js + React (Vite) app
echo "Starting Azure deployment..."

# Set npm cache directory
export npm_config_cache=/tmp/.npm

# Install production dependencies only with optimized settings
echo "Installing dependencies..."
npm ci --production --no-audit --no-fund --prefer-offline

# Build the React frontend
echo "Building React frontend..."
npm run build:frontend

# Install API dependencies
echo "Installing API dependencies..."
cd api && npm ci --production --no-audit --no-fund --prefer-offline && cd ..

# Start the server
echo "Starting server..."
exec node server.js
