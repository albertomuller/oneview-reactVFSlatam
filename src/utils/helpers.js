import { TYPE_ICONS, STATUS_TYPES } from './constants.js';

// Format date to readable string
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    if (format === 'short') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });
    }
    
    if (format === 'long') {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    return date.toLocaleDateString();
  } catch (error) {
    console.warn('Invalid date format:', dateString);
    return dateString;
  }
};

// Get work item type configuration
export const getWorkItemTypeConfig = (type) => {
  return TYPE_ICONS[type] || { icon: 'fa-question-circle', color: '#4A5E65' };
};

// Get status configuration
export const getStatusConfig = (status) => {
  const statusLower = status?.toLowerCase() || '';
  
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
  
  return { color: 'bg-green-500', text: status || 'Active', textColor: 'text-green-700' };
};

// Generate Azure DevOps work item URL
export const generateDevOpsUrl = (workItemId, organization = 'VolvoGroup-MASDCL', project = 'VFSDITSA-1018751-COE LATAM') => {
  return `https://dev.azure.com/${organization}/${encodeURIComponent(project)}/_workitems/edit/${workItemId}`;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize string for safe display
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '');
};

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const clonedObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount) return 'N/A';
  
  // Handle string inputs like "$100k", "€50k"
  if (typeof amount === 'string') {
    return amount;
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount}`;
  }
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate progress percentage
export const calculateProgress = (completed, total) => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Check if date is overdue
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  const due = new Date(dueDate);
  return due < today;
};