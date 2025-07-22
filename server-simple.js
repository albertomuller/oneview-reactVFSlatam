require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

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
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`🚀 OneView running at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
});
