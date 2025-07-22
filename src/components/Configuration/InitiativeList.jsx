import React, { useState } from 'react';
import InitiativeEditor from './InitiativeEditor';

const InitiativeList = ({ initiatives, onInitiativeUpdate }) => {
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter and sort initiatives
  const filteredAndSortedInitiatives = initiatives
    .filter(initiative => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (initiative.fields?.['System.Title'] || initiative.market || '').toLowerCase().includes(searchLower) ||
        (initiative.dpm || '').toLowerCase().includes(searchLower) ||
        (initiative.businessOwner || '').toLowerCase().includes(searchLower) ||
        (initiative.market || '').toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.fields?.['System.Title'] || a.market || '';
          bValue = b.fields?.['System.Title'] || b.market || '';
          break;
        case 'dpm':
          aValue = a.dpm || '';
          bValue = b.dpm || '';
          break;
        case 'status':
          aValue = a.deadlineStatus || '';
          bValue = b.deadlineStatus || '';
          break;
        case 'lastModified':
          aValue = new Date(a.lastModified || 0);
          bValue = new Date(b.lastModified || 0);
          break;
        default:
          aValue = '';
          bValue = '';
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleEditInitiative = (initiative) => {
    setSelectedInitiative(initiative);
  };

  const handleSaveInitiative = (updatedInitiative) => {
    onInitiativeUpdate && onInitiativeUpdate(updatedInitiative);
    setSelectedInitiative(null);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('track') || statusLower.includes('green')) return 'text-green-600 bg-green-100';
    if (statusLower.includes('risk') || statusLower.includes('yellow')) return 'text-yellow-600 bg-yellow-100';
    if (statusLower.includes('delay') || statusLower.includes('red')) return 'text-red-600 bg-red-100';
    if (statusLower.includes('done') || statusLower.includes('complete')) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'fa-sort text-gray-400';
    return sortOrder === 'asc' ? 'fa-sort-up text-primary' : 'fa-sort-down text-primary';
  };

  if (initiatives.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <i className="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Initiatives Found</h3>
        <p className="text-gray-500">Load data from the Configuration tab to see initiatives here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header and Controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Initiatives</h3>
            <p className="text-sm text-gray-500">{filteredAndSortedInitiatives.length} of {initiatives.length} initiatives</p>
          </div>
          
          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search initiatives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-2">
                  Initiative
                  <i className={`fas ${getSortIcon('title')}`}></i>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('dpm')}
              >
                <div className="flex items-center gap-2">
                  DPM
                  <i className={`fas ${getSortIcon('dpm')}`}></i>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <i className={`fas ${getSortIcon('status')}`}></i>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('lastModified')}
              >
                <div className="flex items-center gap-2">
                  Last Modified
                  <i className={`fas ${getSortIcon('lastModified')}`}></i>
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedInitiatives.map((initiative) => (
              <tr key={initiative.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {initiative.fields?.['System.Title'] || initiative.market || 'Untitled'}
                    </div>
                    <div className="text-xs text-gray-500">ID: {initiative.id}</div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {initiative.dpm || 'Not assigned'}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(initiative.deadlineStatus)}`}>
                    {initiative.deadlineStatus || 'Active'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {initiative.market || 'N/A'}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {initiative.lastModified 
                    ? new Date(initiative.lastModified).toLocaleDateString()
                    : 'N/A'
                  }
                </td>
                <td className="px-4 py-4 text-right text-sm">
                  <button
                    onClick={() => handleEditInitiative(initiative)}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Initiative Editor Modal */}
      {selectedInitiative && (
        <InitiativeEditor
          initiative={selectedInitiative}
          onSave={handleSaveInitiative}
          onClose={() => setSelectedInitiative(null)}
        />
      )}
    </div>
  );
};

export default InitiativeList;