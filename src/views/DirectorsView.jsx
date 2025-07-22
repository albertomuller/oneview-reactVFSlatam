import React, { useState, useEffect } from 'react';
import PortfolioCard from '../components/Portfolio/PortfolioCard';
import FilterPanel from '../components/Portfolio/FilterPanel';

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
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Executive Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simplified Header for Directors */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Volvo OneView</h1>
                <p className="text-sm text-gray-500">Executive Portfolio Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                <i className="fas fa-user-tie mr-1"></i>
                Executive View
              </span>
              <a 
                href="/"
                className="text-sm text-primary hover:text-primary-dark"
              >
                <i className="fas fa-cog mr-1"></i>
                Admin Panel
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterPanel
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          initiatives={filteredInitiatives}
          onExportPDF={handleExportPDF}
          onRefresh={handleRefresh}
        />

        <div id="directors-portfolio-content">
          {filteredInitiatives.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Initiatives Found</h3>
              <p className="text-gray-500 mb-6">Adjust filters to view different initiatives</p>
              <button
                onClick={handleClearFilters}
                className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded transition-colors duration-200"
              >
                <i className="fas fa-times mr-2"></i>Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredInitiatives.map(initiative => (
                <PortfolioCard key={initiative.id} initiative={initiative} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DirectorsView;
