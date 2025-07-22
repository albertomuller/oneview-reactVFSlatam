import React from 'react';

const StatusIndicator = ({ status }) => {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || 'active';
    
    if (statusLower.includes('on track') || statusLower.includes('green')) {
      return { color: 'bg-green-500', text: 'On Track', textColor: 'text-green-700' };
    }
    if (statusLower.includes('at risk') || statusLower.includes('yellow') || statusLower.includes('warning')) {
      return { color: 'bg-yellow-500', text: 'At Risk', textColor: 'text-yellow-700' };
    }
    if (statusLower.includes('delayed') || statusLower.includes('red') || statusLower.includes('behind')) {
      return { color: 'bg-red-500', text: 'Delayed', textColor: 'text-red-700' };
    }
    if (statusLower.includes('done') || statusLower.includes('complete')) {
      return { color: 'bg-blue-500', text: 'Done', textColor: 'text-blue-700' };
    }
    if (statusLower.includes('new') || statusLower.includes('planned')) {
      return { color: 'bg-gray-500', text: 'Planned', textColor: 'text-gray-700' };
    }
    
    // Default
    return { color: 'bg-green-500', text: status || 'Active', textColor: 'text-green-700' };
  };

  const { color, text, textColor } = getStatusConfig(status);

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color} animate-pulse`}></div>
      <span className={`text-sm font-medium ${textColor}`}>{text}</span>
    </div>
  );
};

export default StatusIndicator;