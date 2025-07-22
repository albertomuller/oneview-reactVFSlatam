const express = require('express');
const cors = require('cors');
const app = express();
const port = 7071;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for development
const mockInitiatives = [
  {
    id: '12345',
    market: 'Construction Equipment',
    dpm: 'John Smith',
    businessOwner: 'Maria Garcia',
    po: 'David Johnson',
    tdpo: 'Sarah Wilson',
    architect: 'Michael Brown',
    cybersecurity: 'Lisa Davis',
    strategicIntent: 'Develop next-generation construction equipment with enhanced fuel efficiency and reduced emissions.',
    keyResults: 'Achieve 15% fuel efficiency improvement, reduce CO2 emissions by 20%, increase market share by 10%.',
    deadlineStatus: 'On Track',
    extCost: '$2.5M',
    intRes: '12 FTE',
    lastModified: new Date().toISOString(),
    modifiedBy: 'System',
    fields: {
      'System.Title': 'Construction Equipment Innovation',
      'System.WorkItemType': 'Initiative',
      'System.AreaPath': 'Construction Equipment',
      'System.State': 'Active',
      'System.AssignedTo': { displayName: 'John Smith' },
      'System.CreatedBy': { displayName: 'Maria Garcia' }
    }
  },
  {
    id: '12346',
    market: 'Trucks',
    dpm: 'Anna Andersson',
    businessOwner: 'Carlos Rodriguez',
    po: 'Emma Thompson',
    tdpo: 'Robert Lee',
    architect: 'Jennifer White',
    cybersecurity: 'Thomas Anderson',
    strategicIntent: 'Implement autonomous driving features for long-haul trucks to improve safety and efficiency.',
    keyResults: 'Deploy Level 3 autonomous features, reduce accidents by 30%, improve fuel efficiency by 12%.',
    deadlineStatus: 'At Risk',
    extCost: '$5.2M',
    intRes: '25 FTE',
    lastModified: new Date().toISOString(),
    modifiedBy: 'System',
    fields: {
      'System.Title': 'Autonomous Truck Initiative',
      'System.WorkItemType': 'Initiative',
      'System.AreaPath': 'Trucks',
      'System.State': 'Active',
      'System.AssignedTo': { displayName: 'Anna Andersson' },
      'System.CreatedBy': { displayName: 'Carlos Rodriguez' }
    }
  },
  {
    id: '12347',
    market: 'Buses',
    dpm: 'Erik Nilsson',
    businessOwner: 'Sophie Martin',
    po: 'James Wilson',
    tdpo: 'Laura Kim',
    architect: 'Peter Jackson',
    cybersecurity: 'Rachel Green',
    strategicIntent: 'Launch electric bus platform for urban transportation with zero emissions.',
    keyResults: 'Launch 3 electric bus models, achieve 300km range, secure 50 city contracts.',
    deadlineStatus: 'On Track',
    extCost: '$3.8M',
    intRes: '18 FTE',
    lastModified: new Date().toISOString(),
    modifiedBy: 'System',
    fields: {
      'System.Title': 'Electric Bus Platform',
      'System.WorkItemType': 'Initiative',
      'System.AreaPath': 'Buses',
      'System.State': 'Active',
      'System.AssignedTo': { displayName: 'Erik Nilsson' },
      'System.CreatedBy': { displayName: 'Sophie Martin' }
    }
  },
  {
    id: '12348',
    market: 'Marine',
    dpm: 'Isabella Santos',
    businessOwner: 'Hans Mueller',
    po: 'Grace Chen',
    tdpo: 'Alessandro Rossi',
    architect: 'Yuki Tanaka',
    cybersecurity: 'Omar Hassan',
    strategicIntent: 'Develop sustainable marine propulsion systems using alternative fuels.',
    keyResults: 'Reduce marine emissions by 25%, launch methanol engines, capture 15% alternative fuel market.',
    deadlineStatus: 'Delayed',
    extCost: '$4.1M',
    intRes: '22 FTE',
    lastModified: new Date().toISOString(),
    modifiedBy: 'System',
    fields: {
      'System.Title': 'Sustainable Marine Propulsion',
      'System.WorkItemType': 'Initiative',
      'System.AreaPath': 'Marine',
      'System.State': 'Active',
      'System.AssignedTo': { displayName: 'Isabella Santos' },
      'System.CreatedBy': { displayName: 'Hans Mueller' }
    }
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all initiatives
app.get('/api/initiatives', (req, res) => {
  console.log('GET /api/initiatives - Returning mock data');
  res.json(mockInitiatives);
});

// Update initiative
app.put('/api/initiatives/:id', (req, res) => {
  const initiativeId = req.params.id;
  const updatedData = req.body;
  
  console.log('PUT /api/initiatives/' + initiativeId, updatedData);
  
  // Find and update the initiative
  let initiative = mockInitiatives.find(init => init.id === initiativeId);
  
  if (initiative) {
    Object.assign(initiative, updatedData, {
      lastModified: new Date().toISOString(),
      modifiedBy: 'System'
    });
    
    // Update fields for compatibility
    initiative.fields = {
      'System.Title': initiative.market || 'N/A',
      'System.WorkItemType': 'Initiative',
      'System.AreaPath': initiative.market,
      'System.State': initiative.deadlineStatus || 'Active',
      'System.AssignedTo': { displayName: initiative.dpm },
      'System.CreatedBy': { displayName: initiative.businessOwner }
    };
  } else {
    // Create new initiative if it doesn't exist
    initiative = {
      id: initiativeId,
      ...updatedData,
      lastModified: new Date().toISOString(),
      modifiedBy: 'System',
      fields: {
        'System.Title': updatedData.market || 'N/A',
        'System.WorkItemType': 'Initiative',
        'System.AreaPath': updatedData.market,
        'System.State': updatedData.deadlineStatus || 'Active',
        'System.AssignedTo': { displayName: updatedData.dpm },
        'System.CreatedBy': { displayName: updatedData.businessOwner }
      }
    };
    mockInitiatives.push(initiative);
  }
  
  res.json(initiative);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl 
  });
});

app.listen(port, () => {
  console.log(`🚀 OneView API Server running at http://localhost:${port}`);
  console.log(`📊 Endpoints available:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/initiatives`);
  console.log(`   PUT  /api/initiatives/:id`);
  console.log(`\n📁 Mock data: ${mockInitiatives.length} initiatives loaded`);
});
