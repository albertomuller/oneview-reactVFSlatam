import React, { useState, useEffect } from 'react';
import './App.css';

// OneView Original Layout Implementation
function App() {
  const [activeTab, setActiveTab] = useState('config');
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    sql: 'unknown',
    devops: 'unknown'
  });

  // Load data function
  const handleLoadData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/initiatives');
      if (!response.ok) throw new Error('Failed to load initiatives');
      const data = await response.json();
      setInitiatives(data);
    } catch (error) {
      console.error('Error loading initiatives:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test connections
  const testConnections = async () => {
    try {
      // Test SQL
      const sqlResponse = await fetch('/api/health');
      const sqlData = await sqlResponse.json();
      setConnectionStatus(prev => ({
        ...prev,
        sql: sqlData.database === 'connected' ? 'success' : 'error'
      }));

      // Test DevOps
      const devopsResponse = await fetch('/api/test/devops');
      const devopsData = await devopsResponse.json();
      setConnectionStatus(prev => ({
        ...prev,
        devops: devopsData.status === 'ok' ? 'success' : 'error'
      }));
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  useEffect(() => {
    testConnections();
    handleLoadData();
  }, []);

  return (
    <div className="antialiased">
      {/* Header - OneView Style */}
      <header className="volvo-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/2/29/Volvo-Iron-Mark-Black.svg" 
                  className="volvo-logo h-8 w-8" 
                  alt="Volvo Logo"
                />
              </div>
              <div>
                <h1 className="volvo-title">Volvo OneView</h1>
                <p className="volvo-subtitle">Strategic Portfolio Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                <div className="w-5 h-5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-white text-xs"></i>
                </div>
                <span className="text-sm font-medium text-gray-700">Administrator</span>
              </div>
              <button className="btn btn-secondary text-sm">
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
          <nav className="flex border-t border-gray-200 pt-1">
            <button 
              onClick={() => setActiveTab('config')}
              className={`tab-elegant ${activeTab === 'config' ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2">
                <i className="fas fa-cogs"></i>
                <span>Configuration</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`tab-elegant ${activeTab === 'portfolio' ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2">
                <i className="fas fa-chart-bar"></i>
                <span>Portfolio</span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Configuration Tab */}
        {activeTab === 'config' && (
          <ConfigurationTab 
            onLoadData={handleLoadData}
            loading={loading}
            initiatives={initiatives}
            selectedInitiative={selectedInitiative}
            onSelectInitiative={setSelectedInitiative}
            connectionStatus={connectionStatus}
            onTestConnections={testConnections}
          />
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <PortfolioTab 
            initiatives={initiatives}
            onLoadData={handleLoadData}
            loading={loading}
          />
        )}
      </main>

      {/* Toast for notifications */}
      <div id="toast" className="toast">
        {/* Notifications will be shown here */}
      </div>
    </div>
  );
}
    setFilter(key, e.target.value);
  }

  function handleClearFilters() {
    clearFilters();
  }

  // Function to handle initiative updates from the editor
  function handleInitiativeUpdate(updatedInitiative) {
    // In a real app, you might want to refetch or update the local state
    fetchInitiatives();
  }

  // Card component for portfolio (mais fiel ao index.html)
  function OnePagerCard({ initiative }) {
    // Ícone e cor por tipo (simplificado)
    const type = initiative.fields['System.WorkItemType'];
    const typeIcon = {
      'Initiative': { icon: 'fa-rocket', color: '#2D606F' },
      'Epic': { icon: 'fa-crown', color: '#E8B778' },
      'Feature': { icon: 'fa-trophy', color: '#B8A5E8' },
      'User Story': { icon: 'fa-book-open', color: '#678C96' },
      'Bug': { icon: 'fa-bug', color: '#EF4444' },
      'Task': { icon: 'fa-check-square', color: '#96B0B6' },
      'Risk': { icon: 'fa-exclamation-triangle', color: '#F59E0B' },
      'Default': { icon: 'fa-question-circle', color: '#4A5E65' }
    }[type] || { icon: 'fa-question-circle', color: '#4A5E65' };

    // Link para item no Azure DevOps
    const devOpsUrl = `https://dev.azure.com/VolvoGroup-MASDCL/VFSDITSA-1018751-COE%20LATAM/_workitems/edit/${initiative.id}`;

    // Exportação PDF (html2pdf)
    function handleExportPDF() {
      if (window.html2pdf) {
        window.html2pdf(document.getElementById(`onepager-${initiative.id}`));
      } else {
        alert('Biblioteca html2pdf não carregada.');
      }
    }

    // Placeholder para milestones, riscos, OKRs, Gantt (mock visual)
    function Milestones() {
      return (
        <div className="or25-milestones mt-4">
          <div className="or25-title"><i className="fas fa-flag-checkered"></i> Milestones</div>
          <div className="milestone-grid">
            <div className="milestone-card">
              <div className="milestone-date">2025-09-01</div>
              <div className="milestone-name">Kickoff</div>
              <div className="milestone-status">Done</div>
            </div>
            <div className="milestone-card">
              <div className="milestone-date">2025-10-15</div>
              <div className="milestone-name">MVP</div>
              <div className="milestone-status">Planned</div>
            </div>
          </div>
        </div>
      );
    }

    function Gantt() {
      return (
        <div className="gantt-grid mt-4" style={{ minHeight: 40 }}>
          <div className="gantt-bar" style={{ left: 0, width: '40%' , background: '#2D606F', top: 0 }}>Kickoff</div>
          <div className="gantt-bar" style={{ left: '45%', width: '40%', background: '#678C96', top: 30 }}>MVP</div>
        </div>
      );
    }

    return (
      <div className="one-pager-card p-6 relative" id={`onepager-${initiative.id}`}> 
        <div className="flex items-center gap-3 mb-2">
          <i className={`fas ${typeIcon.icon} text-xl`} style={{ color: typeIcon.color }}></i>
          <span className="font-semibold text-lg">{initiative.fields['System.Title']}</span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
          <span className="inline-block px-2 py-0.5 rounded bg-gray-100 border text-gray-700">
            {type}
          </span>
          <span className="inline-block px-2 py-0.5 rounded bg-gray-100 border text-gray-700">
            ID: {initiative.id}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-2">
          <div><b>Market:</b> {initiative.fields['System.AreaPath'] || 'N/A'}</div>
          <div><b>Status:</b> {initiative.fields['System.State'] || 'N/A'}</div>
          <div><b>DPO:</b> {initiative.fields['System.AssignedTo']?.displayName || 'N/A'}</div>
          <div><b>Business Owner:</b> {initiative.fields['System.CreatedBy']?.displayName || 'N/A'}</div>
        </div>
        {/* Status visual */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="status-light status-light-green"></span>
          <span className="text-xs text-gray-500">On Track</span>
        </div>
        {/* Milestones mock */}
        <Milestones />
        {/* Gantt mock */}
        <Gantt />
        {/* Ações: link, exportar PDF */}
        <div className="absolute top-4 right-4 flex gap-2">
          <a href={devOpsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-xs" title="Abrir no Azure DevOps">
            <i className="fas fa-external-link-alt"></i>
          </a>
          <button className="btn btn-secondary btn-xs" onClick={handleExportPDF} title="Exportar PDF">
            <i className="fas fa-file-pdf"></i>
          </button>
        </div>
      </div>
    );
  }

  // Show password dialog if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/29/Volvo-Iron-Mark-Black.svg"
                className="h-12 w-12 mx-auto mb-4"
                alt="Volvo Logo"
              />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Volvo OneView</h1>
              <p className="text-gray-600">Strategic Portfolio Management</p>
            </div>
            
            <button
              onClick={() => setShowPasswordDialog(true)}
              className="w-full btn btn-primary"
            >
              <i className="fas fa-lock mr-2"></i>
              Access OneView
            </button>
          </div>
          
          <PasswordDialog
            isOpen={showPasswordDialog}
            onClose={() => setShowPasswordDialog(false)}
            onSuccess={(password) => {
              if (login(password)) {
                setShowPasswordDialog(false);
              }
            }}
            title="OneView Authentication"
          />
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    logout();
    setActiveTab('config');
  };

  return (
    <Layout>
      <header className="volvo-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/29/Volvo-Iron-Mark-Black.svg"
                  className="volvo-logo h-8 w-8"
                  alt="Volvo Logo"
                />
              </div>
              <div>
                <h1 className="volvo-title">Volvo OneView</h1>
                <p className="volvo-subtitle">Strategic Portfolio Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                <div className="w-5 h-5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-white text-xs"></i>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
              </div>
              <button className="btn btn-secondary text-sm" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
          <nav className="flex border-t border-gray-200 pt-1">
            <button
              className={`tab-elegant ${activeTab === 'config' ? 'active' : ''}`}
              onClick={() => setActiveTab('config')}
            >
              <div className="flex items-center gap-2">
                <i className="fas fa-cogs"></i>
                <span>Configuration</span>
              </div>
            </button>
            <button
              className={`tab-elegant ${activeTab === 'connections' ? 'active' : ''}`}
              onClick={() => setActiveTab('connections')}
            >
              <div className="flex items-center gap-2">
                <i className="fas fa-plug"></i>
                <span>Connections</span>
              </div>
            </button>
            <button
              className={`tab-elegant ${activeTab === 'portfolio' ? 'active' : ''}`}
              onClick={() => setActiveTab('portfolio')}
            >
              <div className="flex items-center gap-2">
                <i className="fas fa-chart-bar"></i>
                <span>Portfolio</span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Configuration Tab */}
        <div className={`tab-content ${activeTab === 'config' ? 'active' : ''}`}>
          <div className="space-y-6">
            {/* Step 1: Load Data */}
            <div className="config-card p-6">
              <h2 className="text-lg font-semibold text-gray-800">Data Synchronization</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Click the button below to load data from Azure DevOps.
              </p>
              {/* Campo de PAT removido, não é mais necessário para SQL */}
              <button className="btn btn-primary" onClick={handleLoadData} disabled={loading}>
                <i className="fas fa-sync-alt mr-2"></i>
                {loading ? 'Loading...' : 'Load Data'}
              </button>
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>

            {/* Step 2: Edit Data */}
            <div className="config-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Edit and View</h2>
                  <p className="text-gray-600 text-sm">Select an initiative to edit custom data.</p>
                </div>
                <button className="btn btn-primary">
                  <i className="fas fa-chart-bar mr-2"></i>View Portfolio
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Initiatives List */}
                <div className="md:col-span-1">
                  <h3 className="text-base font-medium mb-3">Initiatives</h3>
                  <div className="border rounded-lg max-h-96 overflow-y-auto p-2">
                    {initiatives.length === 0 && (
                      <div className="text-gray-500 text-center">No initiatives loaded.</div>
                    )}
                    {initiatives.map(initiative => (
                      <div
                        key={initiative.id}
                        className={`initiative-preview-item border-b last:border-b-0 cursor-pointer p-2 ${selectedInitiative?.id === initiative.id ? 'selected bg-teal-100' : ''}`}
                        onClick={() => setSelectedInitiative(initiative)}
                      >
                        <div className="font-semibold">{initiative.market || initiative.fields?.['System.Title']}</div>
                        <div className="text-xs text-gray-500">
                          DPO: {initiative.dpm || initiative.fields?.['System.AssignedTo']?.displayName || 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Edit Form */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-lg border-2 border-dashed p-4">
                    {selectedInitiative ? (
                      <form className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Market</label>
                          <input className="input-field" value={selectedInitiative.market || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Deadline Status</label>
                          <input className="input-field" value={selectedInitiative.deadlineStatus || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">DPM</label>
                          <input className="input-field" value={selectedInitiative.dpm || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Business Owner</label>
                          <input className="input-field" value={selectedInitiative.businessOwner || ''} readOnly />
                        </div>
                      </form>
                    ) : (
                      <p className="text-center text-gray-500 text-sm">
                        <i className="fas fa-arrow-left text-xl mb-2"></i><br />
                        Select an initiative to edit
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connections Tab */}
        <div className={`tab-content ${activeTab === 'connections' ? 'active' : ''}`}>
          <ConnectionTester />
        </div>

        {/* Portfolio Tab */}
        <div className={`tab-content ${activeTab === 'portfolio' ? 'active' : ''}`}>
        <div className="filter-section mb-6">
          <div className="filter-header px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Strategic Portfolio</h2>
                <p className="text-sm text-gray-600">Executive Initiative Dashboard</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Active Data</span>
                </div>
                <button className="text-xs text-gray-500 hover:text-primary transition-colors duration-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100" onClick={handleLoadData} disabled={loading}>
                  <i className="fas fa-sync-alt text-xs"></i>
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
              {/* Filtros dinâmicos */}
              {Object.entries(filterOptions).map(([key, options]) => (
                <div className="filter-group" key={key}>
                  <label className="filter-label">{key}</label>
                  <select
                    className="executive-select"
                    value={filters[key] || ''}
                    onChange={e => handleFilterChange(e, key)}
                  >
                    <option value="">All</option>
                    {options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <i className="fas fa-filter mr-2"></i>
                {Object.values(filters).some(v => v) ? 'Advanced Filters Applied' : 'No Filters'}
              </div>
              <button className="executive-clear-btn" onClick={handleClearFilters}>
                <i className="fas fa-refresh mr-2"></i>Clear Filters
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {filteredInitiatives.length === 0 ? (
            <div className="config-card p-8 text-center text-gray-500">
              Use the "Configuration" tab to load and edit data.
            </div>
          ) : (
            filteredInitiatives.map(initiative => (
              <OnePagerCard key={initiative.id} initiative={initiative} />
            ))
          )}
        </div>
        </div>
      </main>
      <div id="toast"></div
      >
    </Layout>
  );
}

export default App;
