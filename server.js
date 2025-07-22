require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Static files with proper error handling
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Check if dist folder and index.html exist
if (fs.existsSync(distPath) && fs.existsSync(indexPath)) {
  console.log('✅ Found dist folder and index.html');
  app.use(express.static(distPath));
} else {
  console.log('⚠️ dist folder or index.html not found, serving basic response');
  console.log('distPath:', distPath);
  console.log('indexPath:', indexPath);
}

// Environment variables
const USE_MOCK_DATA = process.env.USE_MOCK_DATA !== 'false';

console.log('🔧 OneView Server Starting...');
console.log('Mode:', USE_MOCK_DATA ? 'MOCK' : 'PRODUCTION');

// Mock data
const mockInitiatives = [
  {
    id: '12345',
    market: 'Construction Equipment',
    dpm: 'John Smith',
    businessOwner: 'Maria Garcia',
    strategicIntent: 'Develop next-generation construction equipment',
    deadlineStatus: 'On Track',
    fields: {
      'System.Title': 'Construction Equipment Innovation',
      'System.WorkItemType': 'Initiative',
      'System.State': 'Active'
    }
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mode: USE_MOCK_DATA ? 'mock' : 'production'
  });
});

app.get('/api/initiatives', (req, res) => {
  console.log('📊 GET /api/initiatives');
  res.json(mockInitiatives);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  console.log('📄 Serving route:', req.path);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback if index.html doesn't exist
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OneView - Portfolio Management</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #333; margin-bottom: 20px; }
          .status { padding: 15px; margin: 20px 0; border-radius: 4px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
          .info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }
          .button { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 10px 5px 0 0; }
          .button:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 OneView - Portfolio Management System</h1>
          
          <div class="success">
            <strong>✅ Server Status:</strong> Running successfully on Azure App Service!
          </div>
          
          <div class="warning">
            <strong>⚠️ Frontend Status:</strong> React build files not found. The frontend will be available after successful deployment.
          </div>
          
          <div class="info">
            <strong>🔧 Current Mode:</strong> ${USE_MOCK_DATA ? 'Mock Data' : 'Production Database'}
          </div>
          
          <h3>🔌 API Endpoints</h3>
          <a href="/api/health" class="button">Health Check</a>
          <a href="/api/initiatives" class="button">View Initiatives</a>
          
          <h3>📋 Server Information</h3>
          <pre>
Port: ${port}
Timestamp: ${new Date().toISOString()}
Environment: Azure App Service
Static Path: ${distPath}
Index Path: ${indexPath}
          </pre>
          
          <div class="info">
            <strong>📖 Next Steps:</strong>
            <ol>
              <li>Ensure the React app is built and the 'dist' folder is included in deployment</li>
              <li>Check that the GitHub Actions workflow completed successfully</li>
              <li>Verify that all files were uploaded to the Azure App Service</li>
            </ol>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log(`🚀 OneView running at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
});
