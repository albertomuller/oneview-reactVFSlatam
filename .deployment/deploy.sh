#!/bin/bash

# Azure App Service deployment script for OneView React
echo "Starting OneView deployment..."

# Set Node.js version
echo "Setting Node.js version..."
export NODE_VERSION=20

# Install dependencies for frontend
echo "Installing frontend dependencies..."
npm install

# Install dependencies for API
echo "Installing API dependencies..."
cd api
npm install
cd ..

# Build the React application
echo "Building React application..."
npm run build

# Copy built files to wwwroot if needed
if [ -d "dist" ]; then
    echo "Copying built files..."
    cp -r dist/* .
fi

# Set up API for production
echo "Setting up API for production..."
cd api
echo "API dependencies installed"
cd ..

echo "Deployment completed successfully!"

# Create startup script
cat > startup.sh << 'EOF'
#!/bin/bash
cd /home/site/wwwroot/api
node server-production.js
EOF

chmod +x startup.sh

echo "OneView React deployment completed!"
