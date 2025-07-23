import React, { useState, useEffect } from 'react';

const DevOpsConfiguration = ({ onSave, onTest, connectionStatus, loading }) => {
  const [config, setConfig] = useState({
    pat: '',
    organization: 'VolvoGroup-MASDCL',
    project: 'VFSDITSA-1018751-COE LATAM',
    queryId: 'c0bf17f0-970c-4577-a40d-2dbd3bddc452',
    okrQueryId: 'ff0981c2-1a04-483b-8553-3b9b185a84b1'
  });
  
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
    localStorage.setItem('devops_config', JSON.stringify(config));
    localStorage.setItem('azure_devops_pat', config.pat);
    
    setConfigChanged(false);
    onSave && onSave(config);
  };

  const handleTest = () => {
    if (configChanged) {
      handleSave();
    }
    onTest && onTest();
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

      {/* Configuration Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Personal Access Token
          </label>
          <input
            type="password"
            value={config.pat}
            onChange={(e) => handleChange('pat', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                      focus:ring-2 focus:ring-primary focus:border-transparent 
                      transition-colors duration-200 text-text-primary"
            placeholder="Enter your Azure DevOps PAT"
          />
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
              disabled={loading || !config.pat.trim()}
              className="px-4 py-2 text-sm border border-border rounded-lg 
                        hover:bg-background transition-colors duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-text-primary"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              onClick={handleSave}
              disabled={!configChanged}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg 
                        hover:bg-primary-dark transition-colors duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevOpsConfiguration;
