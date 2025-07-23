import React, { useState, useEffect } from 'react';
import { azureDevOpsService, validateDevOpsConfiguration } from '../../services/azureDevOps';

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
  const [validationIssues, setValidationIssues] = useState([]);

  useEffect(() => {
    // Load saved configuration
    const savedPat = localStorage.getItem('azure_devops_pat') || '';
    const savedConfig = localStorage.getItem('devops_config');
    
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(prev => ({ ...prev, ...parsed, pat: savedPat }));
      } catch (error) {
        console.error('Error loading DevOps config:', error);
      }
    } else if (savedPat) {
      setConfig(prev => ({ ...prev, pat: savedPat }));
    }

    // Validate configuration on load
    validateConfiguration();
  }, []);

  const validateConfiguration = () => {
    const issues = validateDevOpsConfiguration();
    setValidationIssues(issues);
    return issues.length === 0;
  };

  const handleChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setConfigChanged(true);
    
    // Real-time validation
    setTimeout(() => {
      if (field === 'pat') {
        localStorage.setItem('azure_devops_pat', value);
      }
      validateConfiguration();
    }, 500);
  };

  const handleSave = () => {
    // Save to localStorage
    const { pat, ...configToSave } = config;
    localStorage.setItem('devops_config', JSON.stringify(configToSave));
    localStorage.setItem('azure_devops_pat', pat);
    
    setConfigChanged(false);
    onSave && onSave(config);
    
    console.log('DevOps configuration saved:', {
      ...configToSave,
      pat: pat ? '[CONFIGURED]' : '[NOT SET]'
    });
  };

  const handleTest = async () => {
    // Save current config before testing
    if (configChanged) {
      handleSave();
    }
    
    try {
      const result = await azureDevOpsService.testConnection();
      onTest && onTest(result);
      return result;
    } catch (error) {
      const result = {
        success: false,
        message: error.message,
        organization: config.organization,
        project: config.project
      };
      onTest && onTest(result);
      return result;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      default:
        return 'text-text-muted';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'success':
        return 'Connected';
      case 'error':
        return 'Failed';
      case 'testing':
        return 'Testing...';
      default:
        return 'Not tested';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Azure DevOps Configuration</h2>
        <p className="text-sm text-text-secondary">Configure connection to Azure DevOps for data synchronization</p>
      </div>

      {/* Validation Issues */}
      {validationIssues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="text-red-800 font-medium mb-2">Configuration Issues:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {validationIssues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Configuration Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Personal Access Token
          </label>
          <div className="relative">
            <input
              type={showPat ? 'text' : 'password'}
              value={config.pat}
              onChange={(e) => handleChange('pat', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
              placeholder="Enter your Azure DevOps PAT"
            />
            <button
              type="button"
              onClick={() => setShowPat(!showPat)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-text-muted 
                        hover:text-text-secondary transition-colors duration-200"
            >
              <i className={`fas ${showPat ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Required for API authentication. Stored securely in local storage.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Organization
          </label>
          <input
            type="text"
            value={config.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                      focus:ring-2 focus:ring-primary focus:border-transparent 
                      transition-colors duration-200 text-text-primary"
            placeholder="Organization name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Project
          </label>
          <input
            type="text"
            value={config.project}
            onChange={(e) => handleChange('project', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                      focus:ring-2 focus:ring-primary focus:border-transparent 
                      transition-colors duration-200 text-text-primary"
            placeholder="Project name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Query ID
            </label>
            <input
              type="text"
              value={config.queryId}
              onChange={(e) => handleChange('queryId', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
              placeholder="Query ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              OKR Query ID
            </label>
            <input
              type="text"
              value={config.okrQueryId}
              onChange={(e) => handleChange('okrQueryId', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
              placeholder="OKR Query ID"
            />
          </div>
        </div>
      </div>

      {/* Status and Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Status:</span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleTest}
              disabled={loading || !config.pat.trim() || validationIssues.length > 0}
              className="px-4 py-2 text-sm border border-border rounded-lg 
                        hover:bg-background transition-colors duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-text-primary flex items-center space-x-2"
            >
              <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-plug'}`}></i>
              <span>{loading ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={!configChanged}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg 
                        hover:bg-primary-dark transition-colors duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center space-x-2"
            >
              <i className="fas fa-save"></i>
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevOpsConfiguration;
