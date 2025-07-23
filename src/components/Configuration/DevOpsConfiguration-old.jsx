import React, { useState, useEffect } from 'react';
import VolvoIcon from '../Common/VolvoIcon';

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
        return <VolvoIcon name="check-circle" size={16} color="var(--volvo-green)" />;
      case 'error':
        return <VolvoIcon name="alert-triangle" size={16} color="var(--error)" />;
      case 'testing':
        return <VolvoIcon name="spinner" size={16} color="var(--volvo-blue)" />;
      default:
        return <VolvoIcon name="clock" size={16} color="var(--volvo-gray)" />;
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
      <div style={{ background: 'linear-gradient(135deg, var(--volvo-blue) 0%, var(--volvo-dark-blue) 100%)' }}
           className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="rounded-lg p-2 mr-4"
                 style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <VolvoIcon name="microsoft" size={24} color="var(--volvo-white)" />
            </div>
            <div>
              <h3 className="volvo-heading text-xl text-white">Azure DevOps Configuration</h3>
              <p className="volvo-body text-sm mt-1" style={{ color: 'var(--volvo-teal-light)' }}>
                Configure your DevOps connection and work item queries
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {connectionStatus === 'success' && (
              <div className="flex items-center px-3 py-2 rounded-full"
                   style={{ 
                     color: 'var(--volvo-green-light)', 
                     backgroundColor: 'rgba(56, 161, 105, 0.2)',
                     border: '1px solid rgba(56, 161, 105, 0.2)'
                   }}>
                <VolvoIcon name="check-circle" size={16} className="mr-2" />
                <span className="volvo-body text-sm font-semibold">Connected</span>
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="flex items-center px-3 py-2 rounded-full"
                   style={{ 
                     color: '#FED7D7', 
                     backgroundColor: 'rgba(229, 62, 62, 0.2)',
                     border: '1px solid rgba(229, 62, 62, 0.2)'
                   }}>
                <VolvoIcon name="alert-triangle" size={16} className="mr-2" />
                <span className="volvo-body text-sm font-semibold">Error</span>
              </div>
            )}
            {connectionStatus === 'testing' && (
              <div className="flex items-center px-3 py-2 rounded-full"
                   style={{ 
                     color: 'var(--volvo-teal-light)', 
                     backgroundColor: 'rgba(49, 130, 206, 0.2)',
                     border: '1px solid rgba(49, 130, 206, 0.2)'
                   }}>
                <VolvoIcon name="spinner" size={16} className="mr-2" />
                <span className="volvo-body text-sm font-semibold">Testing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Personal Access Token */}
          <div className="space-y-3">
            <label className="block volvo-subheading text-sm flex items-center">
              <VolvoIcon name="key" size={16} color="var(--volvo-blue)" className="mr-2" />
              Personal Access Token (PAT)
              <span style={{ color: 'var(--error)' }} className="ml-1">*</span>
            </label>
            <div className="relative group">
              <input
                type={showPat ? 'text' : 'password'}
                value={config.pat}
                onChange={(e) => handleChange('pat', e.target.value)}
                className="volvo-input"
                placeholder="Enter your Azure DevOps PAT"
              />
              <button
                type="button"
                onClick={() => setShowPat(!showPat)}
                className="absolute inset-y-0 right-0 flex items-center px-4 transition-colors duration-200"
                style={{ color: 'var(--volvo-gray)' }}
              >
                <VolvoIcon name={showPat ? 'eye-off' : 'eye'} size={18} />
              </button>
            </div>
            <div className="rounded-lg p-3 border-l-4"
                 style={{ 
                   backgroundColor: 'var(--volvo-teal-light)', 
                   borderColor: 'var(--volvo-teal)',
                   color: '#1A365D'
                 }}>
              <p className="volvo-caption font-medium flex items-center">
                <VolvoIcon name="info" size={14} className="mr-1" />
                Required permissions: Work Items (Read), Analytics (Read)
              </p>
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-3">
            <label className="block volvo-subheading text-sm flex items-center">
              <VolvoIcon name="building" size={16} color="var(--volvo-blue)" className="mr-2" />
              Organization
            </label>
            <input
              type="text"
              value={config.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              className="volvo-input"
              placeholder="Your Azure DevOps organization"
            />
          </div>

          {/* Project */}
          <div className="space-y-3">
            <label className="block volvo-subheading text-sm flex items-center">
              <VolvoIcon name="project-diagram" size={16} color="var(--volvo-blue)" className="mr-2" />
              Project
            </label>
            <input
              type="text"
              value={config.project}
              onChange={(e) => handleChange('project', e.target.value)}
              className="volvo-input"
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
