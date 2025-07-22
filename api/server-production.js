require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getConnection, sql } = require('./utils/database');
const app = express();
const port = process.env.PORT || 7071;

// Environment variables
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || false;
const AZURE_DEVOPS_ORG = process.env.AZURE_DEVOPS_ORG || 'VolvoGroup-MASDCL';
const AZURE_DEVOPS_PROJECT = process.env.AZURE_DEVOPS_PROJECT || 'VFSDITSA-1018751-COE LATAM';
const AZURE_DEVOPS_TOKEN = process.env.AZURE_DEVOPS_TOKEN;

console.log('🔧 Server Configuration:');
console.log('  Mock Data:', USE_MOCK_DATA);
console.log('  Azure DevOps Org:', AZURE_DEVOPS_ORG);
console.log('  Azure DevOps Project:', AZURE_DEVOPS_PROJECT);
console.log('  Token configured:', !!AZURE_DEVOPS_TOKEN);

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
  }
];

// Azure DevOps API helper
async function callAzureDevOpsAPI(endpoint) {
  if (!AZURE_DEVOPS_TOKEN) {
    throw new Error('Azure DevOps token not configured');
  }
  
  const axios = require('axios');
  const url = `https://dev.azure.com/${AZURE_DEVOPS_ORG}/_apis/${endpoint}`;
  
  console.log('📞 Calling Azure DevOps API:', url);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`:${AZURE_DEVOPS_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'OneView-React/1.0'
      },
      params: {
        'api-version': '7.0'
      },
      timeout: 30000 // 30 seconds timeout
    });
    
    console.log('✅ Azure DevOps API Success:', response.status);
    return response.data;
  } catch (error) {
    console.error('❌ Azure DevOps API Error:');
    console.error('  URL:', url);
    console.error('  Status:', error.response?.status);
    console.error('  StatusText:', error.response?.statusText);
    console.error('  Message:', error.message);
    console.error('  Data:', error.response?.data);
    throw error;
  }
}

// Database helper to fetch initiatives
async function fetchInitiativesFromDB() {
  const pool = await getConnection();
  const result = await pool.request()
    .query(`
      SELECT 
        wi.Id,
        wi.Title,
        wi.WorkItemType,
        wi.State,
        wi.AreaPath,
        wi.AssignedTo,
        wi.CreatedBy,
        wi.CreatedDate,
        wi.ChangedDate,
        cf.DPM,
        cf.BusinessOwner,
        cf.ProductOwner,
        cf.TechnicalLead,
        cf.Architect,
        cf.CyberSecurity,
        cf.StrategicIntent,
        cf.KeyResults,
        cf.DeadlineStatus,
        cf.ExternalCost,
        cf.InternalResources
      FROM WorkItems wi
      LEFT JOIN CustomFields cf ON wi.Id = cf.WorkItemId
      WHERE wi.WorkItemType = 'Initiative'
        AND wi.State IN ('New', 'Active', 'Resolved')
      ORDER BY wi.ChangedDate DESC
    `);
  
  return result.recordset.map(row => ({
    id: row.Id.toString(),
    market: row.AreaPath,
    dpm: row.DPM,
    businessOwner: row.BusinessOwner,
    po: row.ProductOwner,
    tdpo: row.TechnicalLead,
    architect: row.Architect,
    cybersecurity: row.CyberSecurity,
    strategicIntent: row.StrategicIntent,
    keyResults: row.KeyResults,
    deadlineStatus: row.DeadlineStatus,
    extCost: row.ExternalCost,
    intRes: row.InternalResources,
    lastModified: row.ChangedDate?.toISOString(),
    modifiedBy: row.AssignedTo,
    fields: {
      'System.Title': row.Title,
      'System.WorkItemType': row.WorkItemType,
      'System.AreaPath': row.AreaPath,
      'System.State': row.State,
      'System.AssignedTo': { displayName: row.AssignedTo },
      'System.CreatedBy': { displayName: row.CreatedBy }
    }
  }));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mode: USE_MOCK_DATA ? 'mock' : 'production',
    database: USE_MOCK_DATA ? 'disabled' : 'azure-sql',
    devops: !!AZURE_DEVOPS_TOKEN ? 'configured' : 'not-configured'
  });
});

// Test database connection
app.get('/api/test/database', async (req, res) => {
  try {
    console.log('🔍 Testing database connection...');
    const pool = await getConnection();
    const result = await pool.request().query('SELECT 1 as test, GETDATE() as serverTime');
    
    res.json({
      status: 'success',
      message: 'Database connection successful',
      serverTime: result.recordset[0].serverTime,
      connectionInfo: {
        server: pool.config.server,
        database: pool.config.database
      }
    });
  } catch (error) {
    console.error('❌ Database test failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Test Azure DevOps connection with detailed diagnostics
app.post('/api/test/devops-detailed', async (req, res) => {
  const { token, organization, project } = req.body;
  const testToken = token || AZURE_DEVOPS_TOKEN;
  const testOrg = organization || AZURE_DEVOPS_ORG;
  const testProject = project || AZURE_DEVOPS_PROJECT;

  console.log('🔍 Detailed Azure DevOps test...');
  console.log('Organization:', testOrg);
  console.log('Project:', testProject);
  console.log('Token length:', testToken?.length);

  try {
    const axios = require('axios');
    
    // Test 1: Basic connectivity
    console.log('Test 1: Basic connectivity...');
    const basicResponse = await axios.get(`https://dev.azure.com/${testOrg}/`, { timeout: 10000 });
    console.log('✅ Basic connectivity OK:', basicResponse.status);

    // Test 2: API without auth
    console.log('Test 2: API endpoint without auth...');
    try {
      await axios.get(`https://dev.azure.com/${testOrg}/_apis/projects`, { 
        timeout: 10000,
        params: { 'api-version': '7.0' }
      });
    } catch (error) {
      console.log('Expected 401:', error.response?.status);
    }

    // Test 3: API with auth
    console.log('Test 3: API endpoint with auth...');
    const authResponse = await axios.get(`https://dev.azure.com/${testOrg}/_apis/projects`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`:${testToken}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      params: { 'api-version': '7.0' },
      timeout: 15000
    });

    console.log('✅ Authenticated API call successful');

    res.json({
      status: 'success',
      message: 'Azure DevOps connection successful',
      tests: {
        basicConnectivity: 'passed',
        apiEndpoint: 'passed',
        authentication: 'passed'
      },
      data: {
        projectCount: authResponse.data.count,
        projects: authResponse.data.value?.slice(0, 3).map(p => ({ name: p.name, id: p.id }))
      }
    });

  } catch (error) {
    console.error('❌ Detailed test failed:', error.message);
    
    res.status(500).json({
      status: 'error',
      message: 'Connection test failed',
      error: error.message,
      code: error.code,
      statusCode: error.response?.status,
      details: {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.code === 'ECONNABORTED' ? 'Connection timeout' : null
      }
    });
  }
});

// Test Azure DevOps connection
app.get('/api/test/devops', async (req, res) => {
  try {
    console.log('🔍 Testing Azure DevOps connection...');
    console.log('Organization:', AZURE_DEVOPS_ORG);
    console.log('Project:', AZURE_DEVOPS_PROJECT);
    console.log('Token length:', AZURE_DEVOPS_TOKEN?.length);
    
    // Test with a simpler endpoint first
    const data = await callAzureDevOpsAPI('projects');
    
    res.json({
      status: 'success',
      message: 'Azure DevOps connection successful',
      organization: AZURE_DEVOPS_ORG,
      project: AZURE_DEVOPS_PROJECT,
      apiVersion: '7.0',
      projectsFound: data.count || 0,
      totalProjects: data.value?.length || 0
    });
  } catch (error) {
    console.error('❌ Azure DevOps test failed:', error.message);
    console.error('Status:', error.response?.status);
    console.error('StatusText:', error.response?.statusText);
    
    res.status(500).json({
      status: 'error',
      message: 'Azure DevOps connection failed',
      error: error.message,
      statusCode: error.response?.status,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Get all initiatives
app.get('/api/initiatives', async (req, res) => {
  try {
    console.log('📊 GET /api/initiatives - Mode:', USE_MOCK_DATA ? 'MOCK' : 'PRODUCTION');
    
    let initiatives;
    
    if (USE_MOCK_DATA) {
      initiatives = mockInitiatives;
      console.log('✅ Using mock data:', initiatives.length, 'initiatives');
    } else {
      initiatives = await fetchInitiativesFromDB();
      console.log('✅ Fetched from database:', initiatives.length, 'initiatives');
    }
    
    res.json(initiatives);
  } catch (error) {
    console.error('❌ Error fetching initiatives:', error);
    res.status(500).json({
      error: 'Failed to fetch initiatives',
      details: error.message,
      fallback: 'Try setting USE_MOCK_DATA=true'
    });
  }
});

// Update initiative
app.put('/api/initiatives/:id', async (req, res) => {
  const initiativeId = req.params.id;
  const updatedData = req.body;
  
  try {
    console.log('📝 PUT /api/initiatives/' + initiativeId);
    
    if (USE_MOCK_DATA) {
      // Mock update
      let initiative = mockInitiatives.find(init => init.id === initiativeId);
      
      if (initiative) {
        Object.assign(initiative, updatedData, {
          lastModified: new Date().toISOString(),
          modifiedBy: 'System'
        });
      }
      
      res.json(initiative || { error: 'Initiative not found' });
    } else {
      // Real database update
      const pool = await getConnection();
      
      await pool.request()
        .input('id', sql.Int, parseInt(initiativeId))
        .input('dpm', sql.NVarChar, updatedData.dpm)
        .input('businessOwner', sql.NVarChar, updatedData.businessOwner)
        .input('strategicIntent', sql.NVarChar, updatedData.strategicIntent)
        .input('keyResults', sql.NVarChar, updatedData.keyResults)
        .query(`
          UPDATE CustomFields 
          SET DPM = @dpm,
              BusinessOwner = @businessOwner,
              StrategicIntent = @strategicIntent,
              KeyResults = @keyResults,
              LastModified = GETDATE()
          WHERE WorkItemId = @id
        `);
      
      console.log('✅ Initiative updated in database');
      res.json({ success: true, id: initiativeId, message: 'Updated successfully' });
    }
  } catch (error) {
    console.error('❌ Error updating initiative:', error);
    res.status(500).json({
      error: 'Failed to update initiative',
      details: error.message
    });
  }
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
  console.log(`   GET  /api/test/database`);
  console.log(`   GET  /api/test/devops`);
  console.log(`\n🔧 Configuration:`);
  console.log(`   Mode: ${USE_MOCK_DATA ? 'MOCK DATA' : 'PRODUCTION'}`);
  console.log(`   Database: ${USE_MOCK_DATA ? 'Disabled' : 'Azure SQL'}`);
  console.log(`   DevOps Token: ${AZURE_DEVOPS_TOKEN ? '✅ Configured' : '❌ Missing'}`);
});
