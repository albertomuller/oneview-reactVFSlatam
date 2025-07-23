import React, { useState } from 'react';
import { useAzureDevOps } from '../../hooks/useAzureDevOps';

const DevOpsTest = () => {
  const {
    devopsData,
    okrData,
    loading,
    connectionStatus,
    error,
    loadDevOpsData,
    loadOKRData,
    testConnection,
    validateConfiguration
  } = useAzureDevOps();

  const [testResults, setTestResults] = useState(null);

  const runFullTest = async () => {
    setTestResults(null);
    const results = {
      connection: null,
      configuration: null,
      dataFetch: null,
      okrFetch: null
    };

    try {
      // Test configuration
      const configValid = validateConfiguration();
      results.configuration = configValid ? 'success' : 'error';

      // Test connection
      await testConnection();
      results.connection = connectionStatus === 'success' ? 'success' : 'error';

      // Test data fetching
      try {
        const data = await loadDevOpsData();
        results.dataFetch = data.items.length > 0 ? 'success' : 'warning';
      } catch (err) {
        results.dataFetch = 'error';
      }

      // Test OKR fetching
      try {
        const okrs = await loadOKRData();
        results.okrFetch = okrs.items.length > 0 ? 'success' : 'warning';
      } catch (err) {
        results.okrFetch = 'warning'; // OKRs are optional
      }

    } catch (err) {
      console.error('Test failed:', err);
    }

    setTestResults(results);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'fas fa-check-circle text-green-600';
      case 'warning': return 'fas fa-exclamation-triangle text-yellow-600';
      case 'error': return 'fas fa-times-circle text-red-600';
      default: return 'fas fa-clock text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success': return 'Passed';
      case 'warning': return 'Warning';
      case 'error': return 'Failed';
      default: return 'Not Tested';
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">DevOps Integration Test</h3>
            <p className="text-sm text-gray-600">Comprehensive test of Azure DevOps integration</p>
          </div>
          <button
            onClick={runFullTest}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Full Test'}
          </button>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{devopsData.items.length}</div>
            <div className="text-sm text-gray-600">Work Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{devopsData.relations.length}</div>
            <div className="text-sm text-gray-600">Relations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{okrData.items.length}</div>
            <div className="text-sm text-gray-600">OKR Items</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${connectionStatus === 'success' ? 'text-green-600' : connectionStatus === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
              {connectionStatus === 'success' ? '✓' : connectionStatus === 'error' ? '✗' : '?'}
            </div>
            <div className="text-sm text-gray-600">Connection</div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <i className="fas fa-exclamation-triangle text-red-600"></i>
              <span className="font-medium text-red-800">Error:</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Configuration Validation</span>
              <div className="flex items-center gap-2">
                <i className={getStatusIcon(testResults.configuration)}></i>
                <span>{getStatusText(testResults.configuration)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Connection Test</span>
              <div className="flex items-center gap-2">
                <i className={getStatusIcon(testResults.connection)}></i>
                <span>{getStatusText(testResults.connection)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Data Fetching</span>
              <div className="flex items-center gap-2">
                <i className={getStatusIcon(testResults.dataFetch)}></i>
                <span>{getStatusText(testResults.dataFetch)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">OKR Data Fetching</span>
              <div className="flex items-center gap-2">
                <i className={getStatusIcon(testResults.okrFetch)}></i>
                <span>{getStatusText(testResults.okrFetch)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Data Display */}
      {devopsData.items.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Sample Work Items</h4>
          <div className="space-y-2">
            {devopsData.items.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <span className="font-mono text-sm text-gray-600">#{item.id}</span>
                <span className="font-medium">{item.fields['System.Title']}</span>
                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {item.fields['System.WorkItemType']}
                </span>
                <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
                  {item.fields['System.State']}
                </span>
              </div>
            ))}
            {devopsData.items.length > 5 && (
              <p className="text-sm text-gray-600 text-center py-2">
                ... and {devopsData.items.length - 5} more items
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevOpsTest;
