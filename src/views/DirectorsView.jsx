import React, { useState, useEffect } from 'react';
import PortfolioCard from '../components/Portfolio/PortfolioCard';
import FilterPanel from '../components/Portfolio/FilterPanel';
import VolvoIcon from '../components/Common/VolvoIcon';

// Simplified Directors View - for direct links
const DirectorsView = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [filteredInitiatives, setFilteredInitiatives] = useState([]);

  // Load initiatives on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/initiatives');
        const data = await response.json();
        setInitiatives(data);
        setFilteredInitiatives(data);
      } catch (error) {
        console.error('Failed to load initiatives:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate filter options
  const filterOptions = React.useMemo(() => {
    if (!initiatives.length) return {};

    return {
      market: [...new Set(initiatives.map(i => i.market || i.fields?.['System.AreaPath']).filter(Boolean))],
      status: [...new Set(initiatives.map(i => i.deadlineStatus || i.fields?.['System.State']).filter(Boolean))],
      dpm: [...new Set(initiatives.map(i => i.dpm || i.fields?.['System.AssignedTo']?.displayName).filter(Boolean))]
    };
  }, [initiatives]);

  // Apply filters
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
      const element = document.getElementById('directors-portfolio-content');
      const options = {
        margin: 0.5,
        filename: `OneView_Executive_Summary_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: false 
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      window.html2pdf().set(options).from(element).save();
    } else {
      window.print();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center volvo-fade-in">
          <div className="w-16 h-16 mx-auto mb-6">
            <VolvoIcon name="spinner" size={64} color="var(--volvo-blue)" />
          </div>
          <h2 className="volvo-heading text-2xl mb-2 text-primary">Loading Executive Dashboard</h2>
          <p className="volvo-body text-muted">Preparing your strategic portfolio overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Enhanced Header for Directors with Volvo Branding */}
      <header className="volvo-header">
        <div className="volvo-container">
          <div className="flex items-center justify-between h-20 volvo-fade-in">
            <div className="volvo-flex">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, var(--volvo-blue) 0%, var(--volvo-dark-blue) 100%)' }}>
                <VolvoIcon name="chart-line" size={24} color="var(--volvo-white)" />
              </div>
              <div className="ml-4">
                <h1 className="volvo-logo text-2xl">VOLVO</h1>
                <h2 className="volvo-heading text-xl text-primary">OneView</h2>
                <p className="volvo-caption text-muted">Executive Portfolio Dashboard</p>
              </div>
            </div>
            <div className="volvo-flex">
              <div className="volvo-badge volvo-badge-info">
                <VolvoIcon name="user-tie" size={14} className="mr-2" />
                Executive Access
              </div>
              <a 
                href="/"
                className="volvo-btn volvo-btn-secondary ml-4"
              >
                <VolvoIcon name="settings" size={16} className="mr-2" />
                Admin Panel
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="volvo-container volvo-section">
        <div className="volvo-slide-up">
          <FilterPanel
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            initiatives={filteredInitiatives}
            onExportPDF={handleExportPDF}
            onRefresh={handleRefresh}
          />
        </div>

        <div id="directors-portfolio-content" className="mt-8">
          {filteredInitiatives.length === 0 ? (
            <div className="executive-card text-center py-16 volvo-fade-in">
              <div className="mb-6">
                <VolvoIcon name="search" size={48} color="var(--volvo-gray)" />
              </div>
              <h3 className="volvo-heading text-xl mb-3 text-primary">No Initiatives Found</h3>
              <p className="volvo-body text-muted mb-8 max-w-md mx-auto">
                Adjust your filters to view strategic initiatives, or contact your administrator if you expect to see data here.
              </p>
              <button
                onClick={handleClearFilters}
                className="volvo-btn volvo-btn-primary"
              >
                <VolvoIcon name="filter" size={16} className="mr-2" />
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6 volvo-slide-up">
              {filteredInitiatives.map((initiative, index) => (
                <div 
                  key={initiative.id} 
                  className="volvo-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PortfolioCard initiative={initiative} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DirectorsView;
