import React, { useState, useEffect } from 'react';
import './App.css';
import PortfolioCard from './components/Portfolio/PortfolioCard';
import FilterPanel from './components/Portfolio/FilterPanel';
import Toast from './components/Common/Toast';
import LoginPage from './components/Auth/LoginPage';
import DevOpsConfiguration from './components/Configuration/DevOpsConfiguration';
import { useAuth } from './hooks/useAuth';
import { azureDevOpsService, fetchInitiatives } from './services/azureDevOps';

function App() {
  const { isAuthenticated, user, loading: authLoading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('config');
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    sql: 'unknown',
    devops: 'unknown'
  });
  const [toast, setToast] = useState(null);

  // Show login page if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading OneView...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  // Show toast notification
  const showToast = (message, type = 'info', duration = 4000) => {
    setToast({ message, type, duration });
  };

  // Generate direct link for directors
  const generateDirectorLink = () => {
    const baseUrl = window.location.origin;
    const directUrl = `${baseUrl}/directors?view=portfolio&minimal=true`;
    
    navigator.clipboard.writeText(directUrl).then(() => {
      showToast('Director link copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy link. Please copy manually: ' + directUrl, 'error', 6000);
    });
  };

  // Load initiatives from API with enhanced Azure DevOps integration
  const handleLoadData = async (useRealDevOps = false) => {
    setLoading(true);
    try {
      let data = [];
      
      if (useRealDevOps) {
        // Try to load from real Azure DevOps first
        try {
          showToast('Connecting to Azure DevOps...', 'info', 2000);
          const workItems = await azureDevOpsService.fetchWorkItemsByQuery();
          data = azureDevOpsService.transformWorkItemsToInitiatives(workItems);
          showToast(`Successfully loaded ${data.length} work items from Azure DevOps`, 'success');
        } catch (devOpsError) {
          console.warn('Azure DevOps failed, falling back to API:', devOpsError);
          showToast('Azure DevOps connection failed, using fallback data', 'warning');
          // Fallback to API
          const response = await fetch('/api/initiatives');
          if (!response.ok) throw new Error('Failed to load initiatives');
          data = await response.json();
        }
      } else {
        // Use regular API endpoint
        const response = await fetch('/api/initiatives');
        if (!response.ok) throw new Error('Failed to load initiatives');
        data = await response.json();
      }
      
      console.log('Loaded initiatives:', data);
      setInitiatives(data);
      showToast(`Successfully loaded ${data.length} initiative${data.length !== 1 ? 's' : ''}`, 'success');
    } catch (error) {
      console.error('Error loading initiatives:', error);
      showToast('Failed to load initiatives. Check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test connections with enhanced Azure DevOps testing
  const testConnections = async () => {
    setLoading(true);
    showToast('Testing connections...', 'info', 2000);
    try {
      // Test SQL
      const sqlResponse = await fetch('/api/health');
      const sqlData = await sqlResponse.json();
      const sqlSuccess = sqlData.database === 'connected';
      
      setConnectionStatus(prev => ({
        ...prev,
        sql: sqlSuccess ? 'success' : 'error'
      }));

      // Test Azure DevOps with enhanced service
      try {
        const devOpsResult = await azureDevOpsService.testConnection();
        const devopsSuccess = devOpsResult.success;
        
        setConnectionStatus(prev => ({
          ...prev,
          devops: devopsSuccess ? 'success' : 'error'
        }));

        // Show detailed results
        if (sqlSuccess && devopsSuccess) {
          showToast('All connections successful! Real Azure DevOps data available.', 'success');
        } else if (sqlSuccess || devopsSuccess) {
          showToast('Some connections failed - check configuration', 'warning');
        } else {
          showToast('All connections failed - using mock data', 'error');
        }
      } catch (devopsError) {
        console.error('DevOps connection test failed:', devopsError);
        setConnectionStatus(prev => ({
          ...prev,
          devops: 'error'
        }));
        showToast('DevOps connection failed - check PAT and configuration', 'error');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus({
        sql: 'error',
        devops: 'error'
      });
      showToast('Connection test failed completely', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Connections tab component - merged with ConfigTab
  const ConfigTab = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showConnectionDetails, setShowConnectionDetails] = useState(false);
    const [selectedInitiative, setSelectedInitiative] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [protectedInitiatives, setProtectedInitiatives] = useState(new Set());

    // Show connections tab content when connections tab is active
    if (activeTab === 'connections') {
      return (
        <div className="space-y-6">
          {/* DevOps Configuration */}
          <DevOpsConfiguration
            onSave={(config) => {
              showToast('Azure DevOps configuration saved!', 'success');
            }}
            onTest={() => {
              testConnections();
            }}
            connectionStatus={connectionStatus.devops}
            loading={loading}
          />

          {/* Connection Testing Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <i className="fas fa-link text-2xl text-primary"></i>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Connection Testing</h2>
                <p className="text-sm text-gray-600">Test connections to Azure SQL and Azure DevOps</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Azure SQL Test */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <i className="fas fa-database text-lg text-primary"></i>
                  <h3 className="font-semibold">Test Azure SQL</h3>
                </div>
                <button
                  onClick={testConnections}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test Connection'}
                </button>
                <div className="mt-3">
                  <div className={`p-3 rounded ${
                    connectionStatus.sql === 'success' ? 'bg-green-50 text-green-800' : 
                    connectionStatus.sql === 'error' ? 'bg-red-50 text-red-800' : 'bg-gray-50 text-gray-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <i className={`fas ${
                        connectionStatus.sql === 'success' ? 'fa-check-circle text-green-600' : 
                        connectionStatus.sql === 'error' ? 'fa-times-circle text-red-600' : 'fa-clock text-gray-600'
                      }`}></i>
                      <span className="font-medium">
                        {connectionStatus.sql === 'success' ? 'Azure SQL Database connected' : 
                         connectionStatus.sql === 'error' ? 'Database connection failed' : 'Not Tested'}
                      </span>
                    </div>
                    {connectionStatus.sql === 'error' && (
                      <p className="text-sm mt-1">Using mock data for development</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Azure DevOps Test */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <i className="fab fa-microsoft text-lg text-primary"></i>
                  <h3 className="font-semibold">Test DevOps</h3>
                </div>
                <button
                  onClick={testConnections}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test Connection'}
                </button>
                <div className="mt-3">
                  <div className={`p-3 rounded ${
                    connectionStatus.devops === 'success' ? 'bg-green-50 text-green-800' : 
                    connectionStatus.devops === 'error' ? 'bg-red-50 text-red-800' : 'bg-gray-50 text-gray-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <i className={`fas ${
                        connectionStatus.devops === 'success' ? 'fa-check-circle text-green-600' : 
                        connectionStatus.devops === 'error' ? 'fa-times-circle text-red-600' : 'fa-clock text-gray-600'
                      }`}></i>
                      <span className="font-medium">
                        {connectionStatus.devops === 'success' ? 'Azure DevOps connection successful' : 
                         connectionStatus.devops === 'error' ? 'Connection Failed - Check PAT' : 'Not Tested'}
                      </span>
                    </div>
                    {connectionStatus.devops === 'success' && (
                      <div className="text-sm mt-1 space-y-0.5">
                        <p><strong>Organization:</strong> VolvoGroup-MASDCL</p>
                        <p><strong>Project:</strong> VFSDITSA-1018751-COE LATAM</p>
                        <p><strong>API Version:</strong> 7.0</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Data Loading */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="fas fa-download text-2xl text-primary-dark"></i>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
                <p className="text-sm text-gray-600">Load data from Azure DevOps or use mock data for testing</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleLoadData(true)}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Loading from DevOps...
                  </>
                ) : (
                  <>
                    <i className="fab fa-microsoft mr-2"></i>
                    Load from Azure DevOps
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleLoadData(false)}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Loading Mock Data...
                  </>
                ) : (
                  <>
                    <i className="fas fa-database mr-2"></i>
                    Load Mock Data
                  </>
                )}
              </button>
            </div>
            
            {initiatives.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <i className="fas fa-check-circle text-green-600 mr-1"></i>
                  {initiatives.length} initiatives loaded successfully
                </p>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className="mt-2 text-sm text-green-700 hover:text-green-800 underline"
                >
                  View Portfolio →
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    const handleLoadDataConfig = async (useRealDevOps = false) => {
      setLoading(true);
      try {
        let data = [];
        
        if (useRealDevOps && connectionStatus.devops === 'success') {
          // Try to load from real Azure DevOps first
          try {
            showToast('Loading from Azure DevOps...', 'info', 2000);
            const workItems = await azureDevOpsService.fetchWorkItemsByQuery();
            data = azureDevOpsService.transformWorkItemsToInitiatives(workItems);
            showToast(`Successfully loaded ${data.length} work items from Azure DevOps`, 'success');
          } catch (devOpsError) {
            console.warn('Azure DevOps failed, falling back to API:', devOpsError);
            showToast('Azure DevOps connection failed, using fallback data', 'warning');
            // Fallback to API
            const response = await fetch('/api/initiatives');
            if (!response.ok) throw new Error('Failed to load initiatives');
            data = await response.json();
          }
        } else {
          // Use regular API endpoint
          const response = await fetch('/api/initiatives');
          if (!response.ok) throw new Error('Failed to load initiatives');
          data = await response.json();
        }
        
        console.log('Loaded initiatives:', data);
        setInitiatives(data);
        setCurrentStep(2);
        
        showToast(`Successfully loaded ${data.length} initiative${data.length !== 1 ? 's' : ''}`, 'success');
      } catch (error) {
        console.error('Error loading initiatives:', error);
        showToast('Failed to load initiatives. Check your connection.', 'error');
      } finally {
        setLoading(false);
      }
    };

    const handleSelectInitiative = (initiative) => {
      setSelectedInitiative(initiative);
      setEditForm({
        id: initiative.id,
        market: initiative.market || '',
        dpm: initiative.dpm || '',
        businessOwner: initiative.businessOwner || '',
        po: initiative.po || '',
        tdpo: initiative.tdpo || '',
        architect: initiative.architect || '',
        cybersecurity: initiative.cybersecurity || '',
        strategicIntent: initiative.strategicIntent || '',
        keyResults: initiative.keyResults || '',
        deadlineStatus: initiative.deadlineStatus || 'green',
        extCost: initiative.extCost || '',
        intRes: initiative.intRes || ''
      });
    };

    const handleSaveChanges = async () => {
      try {
        const response = await fetch(`/api/initiatives/${editForm.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editForm)
        });
        
        if (!response.ok) throw new Error('Failed to save changes');
        
        // Update local initiatives data
        setInitiatives(prev => prev.map(init => 
          init.id === editForm.id ? { ...init, ...editForm } : init
        ));
        
        console.log('Changes saved successfully');
        showToast('Changes saved successfully!', 'success');
      } catch (error) {
        console.error('Error saving changes:', error);
        showToast('Failed to save changes. Please try again.', 'error');
      }
    };

    const toggleProtection = () => {
      if (selectedInitiative) {
        setProtectedInitiatives(prev => {
          const newSet = new Set(prev);
          if (newSet.has(selectedInitiative.id)) {
            newSet.delete(selectedInitiative.id);
          } else {
            newSet.add(selectedInitiative.id);
          }
          return newSet;
        });
      }
    };

    return (
      <div className="space-y-6">
        {/* Step 1: Data Synchronization */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Data Synchronization</h2>
            {currentStep > 1 && (
              <button
                onClick={() => setShowConnectionDetails(!showConnectionDetails)}
                className="text-gray-400 hover:text-teal-600"
              >
                <i className="fas fa-cog"></i>
              </button>
            )}
          </div>
          <p className="text-gray-600 mb-6 text-sm">Click the button below to load data from Azure DevOps.</p>
          <div className="flex gap-4">
            <button
              onClick={() => handleLoadDataConfig(false)}
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
            >
              <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'} mr-2`}></i>
              {loading ? 'Loading...' : 'Load Mock Data'}
            </button>
            
            <button
              onClick={() => handleLoadDataConfig(true)}
              disabled={loading || connectionStatus.devops !== 'success'}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
              title={connectionStatus.devops !== 'success' ? 'Configure Azure DevOps in Connections tab first' : 'Load real data from Azure DevOps'}
            >
              <i className={`fab ${loading ? 'fa-spinner fa-spin' : 'fa-microsoft'} mr-2`}></i>
              {loading ? 'Loading...' : 'Load from DevOps'}
            </button>
          </div>
          
          {showConnectionDetails && (
            <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-4 rounded-lg">
              <p><strong>Organization:</strong> VolvoGroup-MASDCL</p>
              <p><strong>Project:</strong> VFSDITSA-1018751-COE LATAM</p>
              <p><strong>Query ID:</strong> c0bf17f0-970c-4577-a40d-2dbd3bddc452</p>
              <p><strong>OKR Query ID:</strong> ff0981c2-1a04-483b-8553-3b9b185a84b1</p>
              <p><strong>PAT Status:</strong> <span className="text-green-600">Configured ✓</span></p>
              <button
                onClick={testConnections}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded text-xs mt-2 transition-colors duration-200"
              >
                Test Connection
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Edit and View */}
        {currentStep >= 2 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Edit and View</h2>
                <p className="text-gray-600 text-sm">Select an initiative to edit custom data.</p>
              </div>
              <button
                onClick={() => setActiveTab('portfolio')}
                className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded transition-colors duration-200"
              >
                <i className="fas fa-chart-bar mr-2"></i>View Portfolio
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h3 className="text-base font-medium mb-3">Initiatives</h3>
                <div className="border rounded-lg max-h-96 overflow-y-auto p-2">
                  {initiatives.map(initiative => (
                    <div
                      key={initiative.id}
                      onClick={() => handleSelectInitiative(initiative)}
                      className={`p-3 rounded cursor-pointer transition-colors duration-200 mb-2 ${
                        selectedInitiative?.id === initiative.id 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-sm">{initiative.strategicIntent || initiative.market}</div>
                      <div className={`text-xs ${selectedInitiative?.id === initiative.id ? 'text-gray-200' : 'text-gray-500'}`}>
                        {initiative.market} • {initiative.dpm}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                {!selectedInitiative ? (
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed">
                    <p className="text-center text-gray-500 text-sm">
                      <i className="fas fa-arrow-left text-xl mb-2"></i><br/>
                      Select an initiative to edit
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-medium">Edit Data</h3>
                      <button
                        onClick={toggleProtection}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded text-sm transition-colors duration-200"
                      >
                        <i className="fas fa-lock mr-2"></i>
                        {protectedInitiatives.has(selectedInitiative.id) ? 'Unlock Initiative' : 'Lock Initiative'}
                      </button>
                    </div>
                    
                    <form className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-sm mb-1">Market</label>
                          <select
                            value={editForm.market || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, market: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          >
                            <option value="">Select Market</option>
                            <option value="Brazil">Brazil</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Chile">Chile</option>
                            <option value="Peru">Peru</option>
                            <option value="Mexico">Mexico</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-medium text-sm mb-1">Deadline Status</label>
                          <select
                            value={editForm.deadlineStatus || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, deadlineStatus: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          >
                            <option value="green">On Time</option>
                            <option value="yellow">At Risk</option>
                            <option value="red">Delayed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-medium text-sm mb-1">DPM</label>
                          <input
                            type="text"
                            value={editForm.dpm || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, dpm: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-sm mb-1">Business Owner</label>
                          <input
                            type="text"
                            value={editForm.businessOwner || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, businessOwner: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-sm mb-1">Product Owner</label>
                          <input
                            type="text"
                            value={editForm.po || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, po: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-sm mb-1">Technical DPO</label>
                          <input
                            type="text"
                            value={editForm.tdpo || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, tdpo: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-sm mb-1">Architect</label>
                          <input
                            type="text"
                            value={editForm.architect || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, architect: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-sm mb-1">Cybersecurity</label>
                          <input
                            type="text"
                            value={editForm.cybersecurity || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, cybersecurity: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-sm mb-1">Strategic Intent</label>
                        <textarea
                          value={editForm.strategicIntent || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, strategicIntent: e.target.value }))}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          rows="3"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-sm mb-1">Key Results</label>
                        <textarea
                          value={editForm.keyResults || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, keyResults: e.target.value }))}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          rows="3"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-sm mb-1">Actual</label>
                          <input
                            type="number"
                            value={editForm.extCost || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, extCost: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-sm mb-1">FCST 25</label>
                          <input
                            type="number"
                            value={editForm.intRes || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, intRes: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: View Portfolio */}
        {currentStep >= 2 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">View Portfolio</h2>
            <p className="text-gray-600 mb-6 text-sm">After editing the data, view the complete portfolio.</p>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('portfolio')}
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded transition-colors duration-200"
              >
                <i className="fas fa-chart-bar mr-2"></i>View Portfolio
              </button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded transition-colors duration-200"
                onClick={generateDirectorLink}
              >
                <i className="fas fa-link mr-2"></i>Generate Direct Link for Directors
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Portfolio tab component
  const PortfolioTab = () => {
    const [filters, setFilters] = useState({});
    const [filteredInitiatives, setFilteredInitiatives] = useState(initiatives);

    // Generate filter options from initiatives data
    const filterOptions = React.useMemo(() => {
      if (!initiatives.length) return {};

      return {
        market: [...new Set(initiatives.map(i => i.market || i.fields?.['System.AreaPath']).filter(Boolean))],
        status: [...new Set(initiatives.map(i => i.deadlineStatus || i.fields?.['System.State']).filter(Boolean))],
        dpm: [...new Set(initiatives.map(i => i.dpm || i.fields?.['System.AssignedTo']?.displayName).filter(Boolean))],
        type: [...new Set(initiatives.map(i => i.fields?.['System.WorkItemType'] || 'Initiative').filter(Boolean))]
      };
    }, [initiatives]);

    // Apply filters whenever filters or initiatives change
    useEffect(() => {
      let filtered = [...initiatives];

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          filtered = filtered.filter(initiative => {
            switch (key) {
              case 'market':
                return (initiative.market || initiative.fields?.['System.AreaPath']) === value;
              case 'status':
                return (initiative.deadlineStatus || initiative.fields?.['System.State']) === value;
              case 'dpm':
                return (initiative.dpm || initiative.fields?.['System.AssignedTo']?.displayName) === value;
              case 'type':
                return (initiative.fields?.['System.WorkItemType'] || 'Initiative') === value;
              default:
                return true;
            }
          });
        }
      });

      setFilteredInitiatives(filtered);
    }, [filters, initiatives]);

    const handleFilterChange = (filterKey, value) => {
      setFilters(prev => ({
        ...prev,
        [filterKey]: value
      }));
    };

    const handleClearFilters = () => {
      setFilters({});
    };

    const handleExportPDF = () => {
      if (window.html2pdf) {
        showToast('Generating PDF...', 'info', 2000);
        const element = document.getElementById('portfolio-content');
        const options = {
          margin: 0.5,
          filename: `OneView_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: false 
          },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        
        window.html2pdf().set(options).from(element).save().then(() => {
          showToast('PDF exported successfully!', 'success');
        }).catch(() => {
          showToast('Failed to export PDF. Try printing instead.', 'error');
        });
      } else {
        showToast('PDF library not loaded. Opening print dialog...', 'warning');
        // Fallback to window.print if html2pdf is not available
        window.print();
      }
    };

    const handleRefresh = () => {
      handleLoadData();
      testConnections();
    };

    return (
      <div className="space-y-6">
        <FilterPanel
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          initiatives={filteredInitiatives}
          onExportPDF={handleExportPDF}
          onRefresh={handleRefresh}
        />

        <div id="portfolio-content">
          {filteredInitiatives.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              {initiatives.length === 0 ? (
                <>
                  <i className="fas fa-database text-4xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                  <p className="text-gray-500 mb-6">Load data from the Configuration tab to view initiatives.</p>
                  <button
                    onClick={() => setActiveTab('config')}
                    className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded transition-colors duration-200"
                  >
                    <i className="fas fa-cog mr-2"></i>Go to Configuration
                  </button>
                </>
              ) : (
                <>
                  <i className="fas fa-filter text-4xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters to see more initiatives.</p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded transition-colors duration-200"
                  >
                    <i className="fas fa-times mr-2"></i>Clear Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredInitiatives.map(initiative => (
                <PortfolioCard key={initiative.id} initiative={initiative} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/2/29/Volvo-Iron-Mark-Black.svg" 
                  className="h-8 w-8" 
                  alt="Volvo Logo"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-primary-dark">Volvo OneView</h1>
                <p className="text-xs text-gray-600">Strategic Portfolio Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  user?.role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                  user?.role === 'manager' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  'bg-gradient-to-r from-teal-500 to-teal-600'
                }`}>
                  <i className={`fas ${
                    user?.role === 'admin' ? 'fa-crown' :
                    user?.role === 'manager' ? 'fa-user-tie' :
                    'fa-user'
                  } text-white text-xs`}></i>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'User'} ({user?.role?.toUpperCase() || 'USER'})
                </span>
              </div>
              <button 
                onClick={() => {
                  logout();
                  showToast('Logged out successfully', 'info');
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 px-3 rounded text-sm transition-colors duration-200"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex border-t border-gray-200 pt-1">
            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'config'
                  ? 'border-primary text-primary bg-primary bg-opacity-5'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-cogs"></i>
              <span>Configuration</span>
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'portfolio'
                  ? 'border-primary text-primary bg-primary bg-opacity-5'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-chart-bar"></i>
              <span>Portfolio</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {(activeTab === 'config' || activeTab === 'connections') && <ConfigTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
      </main>

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
