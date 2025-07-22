#!/bin/bash

echo "=== Pre-deployment Build Script ==="
echo "Building frontend and preparing for Azure deployment..."

# Clean previous builds
rm -rf dist
rm -rf api/node_modules

# Build frontend
echo "Building frontend..."
npm run build:frontend

# Install API dependencies
echo "Installing API dependencies..."
cd api
npm ci --production --no-audit --no-fund --prefer-offline
cd ..

echo "Pre-deployment build completed successfully!"
echo "Frontend built in: dist/"
echo "API dependencies installed in: api/node_modules/"
echo ""
echo "Ready for Azure deployment with minimal startup time!"
