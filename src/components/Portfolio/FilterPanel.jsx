import React from 'react';

const FilterPanel = ({ 
  filters, 
  filterOptions, 
  onFilterChange, 
  onClearFilters, 
  initiatives = [],
  onExportPDF,
  onRefresh
}) => {
  const handleFilterChange = (filterKey, value) => {
    onFilterChange && onFilterChange(filterKey, value);
  };

  const handleClearAll = () => {
    onClearFilters && onClearFilters();
  };

  const activeFilterCount = Object.values(filters || {}).filter(val => val && val !== '').length;

  return (
    <div className="filter-section mb-6">
      <div className="filter-header bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Strategic Portfolio</h2>
              <p className="text-sm text-gray-600">Executive Initiative Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  {initiatives.length} Initiative{initiatives.length !== 1 ? 's' : ''} 
                  {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''})`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onRefresh}
                  className="text-xs text-gray-500 hover:text-primary transition-colors duration-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
                  title="Refresh Data"
                >
                  <i className="fas fa-sync-alt text-xs"></i>
                  <span>Refresh</span>
                </button>
                <button 
                  onClick={onExportPDF}
                  className="text-xs text-gray-500 hover:text-primary transition-colors duration-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
                  title="Export Portfolio to PDF"
                >
                  <i className="fas fa-file-pdf text-xs"></i>
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
            {Object.entries(filterOptions || {}).map(([key, options]) => (
              <div className="filter-group" key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <select
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  value={filters?.[key] || ''}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                >
                  <option value="">All {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                  {options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          
          {/* Filter Actions */}
          {activeFilterCount > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleClearAll}
                className="text-sm text-primary hover:text-primary-dark transition-colors duration-200 flex items-center gap-1"
              >
                <i className="fas fa-times text-xs"></i>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;