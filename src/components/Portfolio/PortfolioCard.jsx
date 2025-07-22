import React from 'react';
import StatusIndicator from './StatusIndicator';
import MilestoneGrid from './MilestoneGrid';
import GanttChart from './GanttChart';

export default function PortfolioCard({ initiative }) {
  const type = initiative.fields?.['System.WorkItemType'] || 'Initiative';
  const typeIcon = {
    'Initiative': { icon: 'fa-rocket', color: '#2D606F' },
    'Epic': { icon: 'fa-crown', color: '#E8B778' },
    'Feature': { icon: 'fa-trophy', color: '#B8A5E8' },
    'User Story': { icon: 'fa-book-open', color: '#678C96' },
    'Bug': { icon: 'fa-bug', color: '#EF4444' },
    'Task': { icon: 'fa-check-square', color: '#96B0B6' },
    'Risk': { icon: 'fa-exclamation-triangle', color: '#F59E0B' }
  }[type] || { icon: 'fa-question-circle', color: '#4A5E65' };

  const devOpsUrl = `https://dev.azure.com/VolvoGroup-MASDCL/VFSDITSA-1018751-COE%20LATAM/_workitems/edit/${initiative.id}`;

  const handleExportPDF = () => {
    if (window.html2pdf) {
      const element = document.getElementById(`onepager-${initiative.id}`);
      const options = {
        margin: 1,
        filename: `${initiative.fields?.['System.Title'] || 'Initiative'}_${initiative.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      window.html2pdf().set(options).from(element).save();
    } else {
      alert('PDF export library not loaded.');
    }
  };

  return (
    <div className="one-pager-card bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative mb-6" id={`onepager-${initiative.id}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <i className={`fas ${typeIcon.icon} text-2xl`} style={{ color: typeIcon.color }}></i>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{initiative.fields?.['System.Title'] || initiative.market || 'Untitled Initiative'}</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 border text-xs text-gray-700">
              {type}
            </span>
            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 border text-xs text-blue-700">
              ID: {initiative.id}
            </span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
        <div>
          <span className="text-gray-500 block">Market</span>
          <span className="font-semibold">{initiative.market || initiative.fields?.['System.AreaPath'] || 'N/A'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Status</span>
          <StatusIndicator status={initiative.deadlineStatus || initiative.fields?.['System.State'] || 'Active'} />
        </div>
        <div>
          <span className="text-gray-500 block">DPM</span>
          <span className="font-semibold">{initiative.dpm || initiative.fields?.['System.AssignedTo']?.displayName || 'N/A'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Business Owner</span>
          <span className="font-semibold">{initiative.businessOwner || initiative.fields?.['System.CreatedBy']?.displayName || 'N/A'}</span>
        </div>
      </div>

      {/* Strategic Intent & Key Results */}
      {(initiative.strategicIntent || initiative.keyResults) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          {initiative.strategicIntent && (
            <div className="mb-3">
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Strategic Intent</h4>
              <p className="text-sm text-gray-600">{initiative.strategicIntent}</p>
            </div>
          )}
          {initiative.keyResults && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Key Results</h4>
              <p className="text-sm text-gray-600">{initiative.keyResults}</p>
            </div>
          )}
        </div>
      )}

      {/* Milestones */}
      <MilestoneGrid initiative={initiative} />

      {/* Gantt Chart */}
      <GanttChart initiative={initiative} />

      {/* Team & Resources */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200 text-xs">
        <div>
          <span className="text-gray-500 block">PO</span>
          <span className="font-medium">{initiative.po || 'N/A'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Tech Lead</span>
          <span className="font-medium">{initiative.tdpo || 'N/A'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Architect</span>
          <span className="font-medium">{initiative.architect || 'N/A'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Cybersecurity</span>
          <span className="font-medium">{initiative.cybersecurity || 'N/A'}</span>
        </div>
      </div>

      {/* Costs */}
      {(initiative.extCost || initiative.intRes) && (
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 text-xs">
          <div>
            <span className="text-gray-500 block">External Cost</span>
            <span className="font-bold text-lg text-green-600">{initiative.extCost || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Internal Resources</span>
            <span className="font-bold text-lg text-blue-600">{initiative.intRes || 'N/A'}</span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <a 
          href={devOpsUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
          title="Open in Azure DevOps"
        >
          <i className="fas fa-external-link-alt text-gray-600"></i>
        </a>
        <button 
          onClick={handleExportPDF}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
          title="Export as PDF"
        >
          <i className="fas fa-file-pdf text-gray-600"></i>
        </button>
      </div>
    </div>
  );
}