import React, { useState } from 'react';
import Modal from '../Common/Modal';

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
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
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
      onSave(updatedInitiative);
      onClose();
    } catch (err) {
      setError('Failed to save initiative. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = ['On Track', 'At Risk', 'Delayed', 'Completed'];

  return (
    <Modal title={`Edit ${initiative?.title || 'Initiative'}`} onClose={onClose}>
      <div className="space-y-4">
        {error && (
          <div className="text-sm text-error bg-red-50 px-3 py-2 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Market
            </label>
            <input
              type="text"
              value={formData.market}
              onChange={(e) => handleInputChange('market', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              DPM
            </label>
            <input
              type="text"
              value={formData.dpm}
              onChange={(e) => handleInputChange('dpm', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Business Owner
            </label>
            <input
              type="text"
              value={formData.businessOwner}
              onChange={(e) => handleInputChange('businessOwner', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              PO
            </label>
            <input
              type="text"
              value={formData.po}
              onChange={(e) => handleInputChange('po', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              TDPO
            </label>
            <input
              type="text"
              value={formData.tdpo}
              onChange={(e) => handleInputChange('tdpo', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Architect
            </label>
            <input
              type="text"
              value={formData.architect}
              onChange={(e) => handleInputChange('architect', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Cybersecurity
            </label>
            <input
              type="text"
              value={formData.cybersecurity}
              onChange={(e) => handleInputChange('cybersecurity', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Status
            </label>
            <select
              value={formData.deadlineStatus}
              onChange={(e) => handleInputChange('deadlineStatus', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              External Cost
            </label>
            <input
              type="text"
              value={formData.extCost}
              onChange={(e) => handleInputChange('extCost', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Internal Resources
            </label>
            <input
              type="text"
              value={formData.intRes}
              onChange={(e) => handleInputChange('intRes', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                        focus:ring-2 focus:ring-primary focus:border-transparent 
                        transition-colors duration-200 text-text-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Strategic Intent
          </label>
          <textarea
            value={formData.strategicIntent}
            onChange={(e) => handleInputChange('strategicIntent', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                      focus:ring-2 focus:ring-primary focus:border-transparent 
                      transition-colors duration-200 text-text-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Key Results
          </label>
          <textarea
            value={formData.keyResults}
            onChange={(e) => handleInputChange('keyResults', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background 
                      focus:ring-2 focus:ring-primary focus:border-transparent 
                      transition-colors duration-200 text-text-primary resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-border rounded-lg 
                    hover:bg-background transition-colors duration-200
                    text-text-primary"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm bg-primary text-white rounded-lg 
                    hover:bg-primary-dark transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </Modal>
  );
};

export default InitiativeEditor;
