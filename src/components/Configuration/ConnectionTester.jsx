import React, { useState } from 'react';

function ConnectionTester() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testConnection = async (endpoint, testName) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/test/${endpoint}`);
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [testName]: {
          status: response.ok ? 'success' : 'error',
          data: data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [testName]: {
          status: 'error',
          data: { message: error.message },
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    }
    setLoading(false);
  };

  const detailedDevOpsTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test/devops-detailed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        detailedDevOps: {
          status: response.ok ? 'success' : 'error',
          data: data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        detailedDevOps: {
          status: 'error',
          data: { message: error.message },
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    }
    setLoading(false);
  };

  const syncWithDevOps = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sync/devops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        sync: {
          status: response.ok ? 'success' : 'error',
          data: data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        sync: {
          status: 'error',
          data: { message: error.message },
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    }
    setLoading(false);
  };

  const ResultCard = ({ title, result }) => {
    if (!result) return null;
    
    const isSuccess = result.status === 'success';
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`p-4 rounded-lg border ${bgColor} ${borderColor}`}>
        <div className="flex items-center gap-2 mb-2">
          <i className={`fas ${isSuccess ? 'fa-check-circle' : 'fa-times-circle'} ${iconColor}`}></i>
          <h3 className={`font-semibold ${textColor}`}>{title}</h3>
          <span className="text-sm text-gray-500">({result.timestamp})</span>
        </div>
        
        <div className={`text-sm ${textColor}`}>
          <p className="mb-2">{result.data.message}</p>
          
          {result.data.serverTime && (
            <p><strong>Server Time:</strong> {new Date(result.data.serverTime).toLocaleString()}</p>
          )}
          
          {result.data.connectionInfo && (
            <div className="mt-2">
              <p><strong>Server:</strong> {result.data.connectionInfo.server}</p>
              <p><strong>Database:</strong> {result.data.connectionInfo.database}</p>
            </div>
          )}
          
          {result.data.organization && (
            <div className="mt-2">
              <p><strong>Organization:</strong> {result.data.organization}</p>
              <p><strong>Project:</strong> {result.data.project}</p>
              <p><strong>API Version:</strong> {result.data.apiVersion}</p>
            </div>
          )}
          
          {result.data.itemsProcessed !== undefined && (
            <p><strong>Items Processed:</strong> {result.data.itemsProcessed}</p>
          )}
          
          {result.data.error && (
            <div className="mt-2 p-2 bg-red-100 rounded text-red-700">
              <strong>Error:</strong> {result.data.error}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🔧 Connection Tester</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => testConnection('database', 'database')}
          disabled={loading}
          className="btn btn-primary flex items-center justify-center gap-2"
        >
          <i className="fas fa-database"></i>
          Test Azure SQL
        </button>
        
        <button
          onClick={() => testConnection('devops', 'devops')}
          disabled={loading}
          className="btn btn-primary flex items-center justify-center gap-2"
        >
          <i className="fab fa-microsoft"></i>
          Test DevOps
        </button>
        
        <button
          onClick={detailedDevOpsTest}
          disabled={loading}
          className="btn btn-secondary flex items-center justify-center gap-2"
        >
          <i className="fas fa-search"></i>
          Detailed Test
        </button>
        
        <button
          onClick={syncWithDevOps}
          disabled={loading}
          className="btn btn-secondary flex items-center justify-center gap-2"
        >
          <i className="fas fa-sync"></i>
          Sync DevOps
        </button>
        
        <button
          onClick={() => setResults({})}
          className="btn btn-outline flex items-center justify-center gap-2"
        >
          <i className="fas fa-trash"></i>
          Clear Results
        </button>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center p-4 mb-4 bg-blue-50 rounded-lg">
          <i className="fas fa-spinner fa-spin text-blue-600 mr-2"></i>
          <span className="text-blue-800">Testing connection...</span>
        </div>
      )}
      
      <div className="space-y-4">
        <ResultCard title="Azure SQL Database" result={results.database} />
        <ResultCard title="Azure DevOps" result={results.devops} />
        <ResultCard title="Detailed DevOps Test" result={results.detailedDevOps} />
        <ResultCard title="DevOps Sync" result={results.sync} />
      </div>
      
      {Object.keys(results).length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-info-circle text-4xl mb-4 opacity-50"></i>
          <p>Click the buttons above to test your connections</p>
        </div>
      )}
    </div>
  );
}

export default ConnectionTester;
