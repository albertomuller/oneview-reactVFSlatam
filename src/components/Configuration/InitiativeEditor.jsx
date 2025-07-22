import React, { useState } from 'react';
import Modal from '../Common/Modal';
import Toast from '../Common/Toast';

const InitiativeEditor = ({ initiative, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    market: initiative?.market || '',
    dpm: initiative?.dpm || '',
    businessOwner: initiative?.businessOwner || '',
    po: initiative?.po || '',
    tdpo: initiative?.tdpo || '',
    architect: initiative?.architect || '',
    cybersecurity: initiative?.cybersecurity || '',
    strategicIntent: initiative?.strategicIntent || '',
    keyResults: initiative?.keyResults || '',
    deadlineStatus: initiative?.deadlineStatus || 'On Track',
    extCost: initiative?.extCost || '',
    intRes: initiative?.intRes || ''
  });
  
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Call the API to save the initiative
      const response = await fetch(`/api/initiatives/${initiative.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save initiative');
      }

      const updatedInitiative = await response.json();
      
      setToast({
        type: 'success',
        message: 'Initiative saved successfully!'
      });
      
      onSave && onSave(updatedInitiative);
      
      setTimeout(() => {
        onClose && onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving initiative:', error);
      setToast({
        type: 'error',
        message: 'Failed to save initiative. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = [
    'On Track',
    'At Risk',
    'Delayed',
    'Completed',
    'On Hold'
  ];

  if (!initiative) {
    return null;
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`Edit Initiative: ${initiative.fields?.['System.Title'] || initiative.market}`}>
      <div className="max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Basic Information</h4>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Market</label>
            <input
              type="text"
              value={formData.market}
              onChange={(e) => handleInputChange('market', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter market"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.deadlineStatus}
              onChange={(e) => handleInputChange('deadlineStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Team Members */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2 mt-4">Team & Ownership</h4>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">DPM</label>
            <input
              type="text"
              value={formData.dpm}
              onChange={(e) => handleInputChange('dpm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Digital Product Manager"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Business Owner</label>
            <input
              type="text"
              value={formData.businessOwner}
              onChange={(e) => handleInputChange('businessOwner', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Business Owner"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Product Owner</label>
            <input
              type="text"
              value={formData.po}
              onChange={(e) => handleInputChange('po', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Product Owner"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Technical Lead</label>
            <input
              type="text"
              value={formData.tdpo}
              onChange={(e) => handleInputChange('tdpo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Technical Lead"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Architect</label>
            <input
              type="text"
              value={formData.architect}
              onChange={(e) => handleInputChange('architect', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Solution Architect"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Cybersecurity</label>
            <input
              type="text"
              value={formData.cybersecurity}
              onChange={(e) => handleInputChange('cybersecurity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Cybersecurity Lead"
            />
          </div>

          {/* Strategy & Objectives */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2 mt-4">Strategy & Objectives</h4>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Strategic Intent</label>
            <textarea
              value={formData.strategicIntent}
              onChange={(e) => handleInputChange('strategicIntent', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Describe the strategic intent and business value..."
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Key Results</label>
            <textarea
              value={formData.keyResults}
              onChange={(e) => handleInputChange('keyResults', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Define key measurable results and success criteria..."
            />
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2 mt-4">Resources & Budget</h4>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">External Cost</label>
            <input
              type="text"
              value={formData.extCost}
              onChange={(e) => handleInputChange('extCost', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., $100k, €50k"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Internal Resources</label>
            <input
              type="text"
              value={formData.intRes}
              onChange={(e) => handleInputChange('intRes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 5 FTE, 20 person-months"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </Modal>
  );
};

export default InitiativeEditor;