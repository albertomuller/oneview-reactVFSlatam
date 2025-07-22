import React, { useState, useEffect } from 'react';

const DevOpsConfiguration = ({ onSave, onTest, connectionStatus, loading }) => {
  const [config, setConfig] = useState({
    pat: '',
    organization: 'VolvoGroup-MASDCL',
    project: 'VFSDITSA-1018751-COE LATAM',
    queryId: 'c0bf17f0-970c-4577-a40d-2dbd3bddc452',
    okrQueryId: 'ff0981c2-1a04-483b-8553-3b9b185a84b1'
  });
  
  const [showPat, setShowPat] = useState(false);
  const [configChanged, setConfigChanged] = useState(false);

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('devops_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading DevOps config:', error);
      }
    }
  }, []);

  const handleChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setConfigChanged(true);
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('devops_config', JSON.stringify(config));
    // Save PAT separately for API usage
    localStorage.setItem('azure_devops_pat', config.pat);
    
    setConfigChanged(false);
    onSave && onSave(config);
  };

  const handleTest = () => {
    // Save current config before testing
    if (configChanged) {
      handleSave();
    }
    onTest && onTest();
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'success':
        return <i className="fas fa-check-circle text-green-600"></i>;
      case 'error':
        return <i className="fas fa-times-circle text-red-600"></i>;
      default:
        return <i className="fas fa-clock text-gray-600"></i>;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'success':
        return 'Connection successful';
      case 'error':
        return 'Connection failed';
      default:
        return 'Not tested';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/10 rounded-lg p-2 mr-4">
              <i className="fab fa-microsoft text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Azure DevOps Configuration</h3>
              <p className="text-blue-100 text-sm mt-1">Configure your DevOps connection and work item queries</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {connectionStatus === 'success' && (
              <div className="flex items-center text-green-100 bg-green-500/20 px-3 py-2 rounded-full border border-green-400/20">
                <i className="fas fa-check-circle mr-2"></i>
                <span className="text-sm font-semibold">Connected</span>
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="flex items-center text-red-100 bg-red-500/20 px-3 py-2 rounded-full border border-red-400/20">
                <i className="fas fa-times-circle mr-2"></i>
                <span className="text-sm font-semibold">Error</span>
              </div>
            )}
            {connectionStatus === 'testing' && (
              <div className="flex items-center text-blue-100 bg-blue-500/20 px-3 py-2 rounded-full border border-blue-400/20">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                <span className="text-sm font-semibold">Testing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Personal Access Token */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 flex items-center">
              <i className="fas fa-key text-primary mr-2"></i>
              Personal Access Token (PAT)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative group">
              <input
                type={showPat ? 'text' : 'password'}
                value={config.pat}
                onChange={(e) => handleChange('pat', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 group-hover:border-gray-300 bg-gray-50/30"
                placeholder="Enter your Azure DevOps PAT"
              />
              <button
                type="button"
                onClick={() => setShowPat(!showPat)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <i className={`fas ${showPat ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
              <p className="text-xs text-blue-700 font-medium flex items-center">
                <i className="fas fa-info-circle mr-1"></i>
                Required permissions: Work Items (Read), Analytics (Read)
              </p>
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 flex items-center">
              <i className="fas fa-building text-primary mr-2"></i>
              Organization
            </label>
            <input
              type="text"
              value={config.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-gray-300 bg-gray-50/30"
              placeholder="Your Azure DevOps organization"
            />
          </div>

          {/* Project */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 flex items-center">
              <i className="fas fa-project-diagram text-primary mr-2"></i>
              Project
            </label>
            <input
              type="text"
              value={config.project}
              onChange={(e) => handleChange('project', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-gray-300 bg-gray-50/30"
              placeholder="Your Azure DevOps project"
            />
          </div>

          {/* Query IDs Section */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h4 className="text-md font-bold text-gray-700 mb-4 flex items-center">
              <i className="fas fa-search text-primary mr-2"></i>
              Work Item Queries
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Main Query ID
                </label>
                <input
                  type="text"
                  value={config.queryId}
                  onChange={(e) => handleChange('queryId', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-gray-300 bg-white"
                  placeholder="Work items query ID"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  OKR Query ID
                </label>
                <input
                  type="text"
                  value={config.okrQueryId}
                  onChange={(e) => handleChange('okrQueryId', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-gray-300 bg-white"
                  placeholder="OKR items query ID"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={!configChanged}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold shadow-lg transform hover:scale-105 active:scale-95"
              >
                <i className="fas fa-save mr-2"></i>
                Save Configuration
              </button>
              
              <button
                onClick={handleTest}
                disabled={loading || !config.pat}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold shadow-lg transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plug mr-2"></i>
                    Test Connection
                  </>
                  )}
              </button>
            </div>

            {/* Status */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-sm font-semibold">{getStatusText()}</span>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 mt-6">
            <h4 className="text-md font-bold text-blue-800 mb-3 flex items-center">
              <i className="fas fa-info-circle mr-2"></i>
              How to get your Personal Access Token
            </h4>
            <ol className="text-sm text-blue-700 space-y-2 ml-4">
              <li className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                Go to Azure DevOps → User Settings → Personal access tokens
              </li>
              <li className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                Click "New Token"
              </li>
              <li className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                Set expiration and select scopes: "Work Items (Read)" and "Analytics (Read)"
              </li>
              <li className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                Copy the generated token and paste it above
              </li>
            </ol>
            <div className="bg-white/50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-700 font-medium flex items-center">
                <i className="fas fa-shield-alt mr-2"></i>
                Your PAT is stored securely in local storage and used only for API authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevOpsConfiguration;
