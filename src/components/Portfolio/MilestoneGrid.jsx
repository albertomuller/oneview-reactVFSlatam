import React from 'react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';

const MilestoneGrid = ({ initiative }) => {
  // Mock milestones data - in real implementation, this would come from the API
  const generateMockMilestones = (initiative) => {
    const today = new Date();
    const futureDate1 = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now
    const futureDate2 = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days from now
    const pastDate = new Date(today.getTime() - (15 * 24 * 60 * 60 * 1000)); // 15 days ago
    
    return [
      {
        id: 1,
        name: 'Project Kickoff',
        date: pastDate.toISOString().split('T')[0],
        status: 'completed',
        description: 'Initial project setup and team alignment'
      },
      {
        id: 2,
        name: 'MVP Release',
        date: futureDate1.toISOString().split('T')[0],
        status: 'planned',
        description: 'Minimum Viable Product delivery'
      },
      {
        id: 3,
        name: 'Go Live',
        date: futureDate2.toISOString().split('T')[0],
        status: 'planned',
        description: 'Production release and rollout'
      }
    ];
  };

  const milestones = initiative.milestones || generateMockMilestones(initiative);

  const getMilestoneStatus = (milestone) => {
    if (milestone.status === 'completed') {
      return { color: 'bg-green-500', textColor: 'text-green-700', icon: 'fa-check-circle' };
    }
    
    try {
      const milestoneDate = parseISO(milestone.date);
      const today = new Date();
      
      if (isBefore(milestoneDate, today) && milestone.status !== 'completed') {
        return { color: 'bg-red-500', textColor: 'text-red-700', icon: 'fa-exclamation-circle' };
      }
      
      if (isAfter(milestoneDate, today)) {
        return { color: 'bg-blue-500', textColor: 'text-blue-700', icon: 'fa-clock' };
      }
    } catch (error) {
      console.warn('Invalid date format for milestone:', milestone.date);
    }
    
    return { color: 'bg-gray-500', textColor: 'text-gray-700', icon: 'fa-circle' };
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (!milestones || milestones.length === 0) {
    return (
      <div className="mb-6">
        <h4 className="or25-title">
          <i className="fas fa-flag-checkered"></i>
          MILESTONES
        </h4>
        <div className="text-sm text-gray-500 text-center py-4">
          No milestones available
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h4 className="or25-title">
        <i className="fas fa-flag-checkered"></i>
        MILESTONES
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {milestones.map((milestone) => {
          const { color, textColor, icon } = getMilestoneStatus(milestone);
          
          return (
            <div key={milestone.id} className="milestone-card bg-gray-50 rounded-lg p-3 border hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <i className={`fas ${icon} text-sm ${textColor}`}></i>
                <span className={`text-xs font-medium ${textColor} uppercase tracking-wide`}>
                  {milestone.status || 'Planned'}
                </span>
              </div>
              <div className="milestone-name text-sm font-semibold text-gray-900 mb-1">
                {milestone.name}
              </div>
              <div className="milestone-date text-xs text-gray-600 mb-2">
                {formatDate(milestone.date)}
              </div>
              {milestone.description && (
                <div className="text-xs text-gray-500">
                  {milestone.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilestoneGrid;