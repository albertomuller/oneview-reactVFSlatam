import React, { useState, useEffect } from 'react';
import './App.css';
import PortfolioCard from './components/Portfolio/PortfolioCard';

function App() {
  const [activeTab, setActiveTab] = useState('config');
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    sql: 'unknown',
    devops: 'unknown'
  });

  // Load initiatives from API
  const handleLoadData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/initiatives');
      if (!response.ok) throw new Error('Failed to load initiatives');
      const data = await response.json();
      console.log('Loaded initiatives:', data);
      setInitiatives(data);
    } catch (error) {
      console.error('Error loading initiatives:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test connections
  const testConnections = async () => {
    setLoading(true);
    try {
      // Test SQL
      const sqlResponse = await fetch('/api/health');
      const sqlData = await sqlResponse.json();
      setConnectionStatus(prev => ({
        ...prev,
        sql: sqlData.database === 'connected' ? 'success' : 'error'
      }));

      // Test DevOps - create endpoint if needed
      try {
        const devopsResponse = await fetch('/api/initiatives');
        setConnectionStatus(prev => ({
          ...prev,
          devops: devopsResponse.ok ? 'success' : 'error'
        }));
      } catch (devopsError) {
        setConnectionStatus(prev => ({
          ...prev,
          devops: 'error'
        }));
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus({
        sql: 'error',
        devops: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Configuration tab component
  const ConfigTab = () => {
    return (
      <div className="space-y-6">
        {/* Connection Tester */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <i className="fas fa-link text-2xl text-primary-dark"></i>
            <h2 className="text-xl font-bold text-gray-900">Connection Tester</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                       connectionStatus.devops === 'error' ? 'Connection Failed' : 'Not Tested'}
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

        {/* Load Data Button */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <i className="fas fa-download text-2xl text-primary-dark"></i>
            <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
          </div>
          <button
            onClick={handleLoadData}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Loading Initiatives...
              </>
            ) : (
              <>
                <i className="fas fa-sync mr-2"></i>
                Load Initiatives
              </>
            )}
          </button>
          {initiatives.length > 0 && (
            <p className="mt-3 text-sm text-gray-600">
              <i className="fas fa-check-circle text-green-600 mr-1"></i>
              {initiatives.length} initiatives loaded
            </p>
          )}
        </div>
      </div>
    );
  };

  // Portfolio tab component
  const PortfolioTab = () => {
    if (initiatives.length === 0) {
      return (
        <div className="text-center py-12">
          <i className="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg">No initiatives loaded</p>
          <p className="text-gray-400 text-sm">Switch to Configuration tab to load data</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Overview</h2>
          <span className="text-sm text-gray-500">{initiatives.length} initiatives</span>
        </div>
        
        <div className="space-y-6">
          {initiatives.map((initiative) => (
            <PortfolioCard key={initiative.id} initiative={initiative} />
          ))}
        </div>
      </div>
    );
  };

  // Load data on component mount
  useEffect(() => {
    handleLoadData();
    testConnections();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Volvo OneView</h1>
                <p className="text-sm text-gray-500">Strategic Portfolio Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                <i className="fas fa-user-circle mr-1"></i>
                Administrator
              </span>
              <button className="text-sm text-primary hover:text-primary-dark">
                <i className="fas fa-sign-out-alt mr-1"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('config')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'config'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-cog mr-2"></i>
              Configuration
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'connections'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-link mr-2"></i>
              Connections
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'portfolio'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-chart-bar mr-2"></i>
              Portfolio
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(activeTab === 'config' || activeTab === 'connections') && <ConfigTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
      </main>

      {/* Toast for notifications */}
      <div id="toast" className="toast">
        {/* Notifications will be shown here */}
      </div>
    </div>
  );
}

export default App;
