// Application constants
export const APP_NAME = 'Volvo OneView';
export const APP_VERSION = '2.0.0';

// Azure DevOps configuration
export const AZURE_DEVOPS_CONFIG = {
  organization: 'VolvoGroup-MASDCL',
  project: 'VFSDITSA-1018751-COE LATAM'
};

// Work item types
export const WORK_ITEM_TYPES = {
  INITIATIVE: 'Initiative',
  EPIC: 'Epic',
  FEATURE: 'Feature',
  USER_STORY: 'User Story',
  BUG: 'Bug',
  TASK: 'Task',
  RISK: 'Risk'
};

// Status types
export const STATUS_TYPES = {
  ON_TRACK: 'On Track',
  AT_RISK: 'At Risk',
  DELAYED: 'Delayed',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  PLANNED: 'Planned'
};

// Theme colors
export const THEME_COLORS = {
  primary: {
    dark: '#2D606F',
    default: '#396976',
    light: '#678C96',
    lighter: '#96B0B6'
  },
  secondary: '#C3D2D6',
  background: '#FAFBFB',
  surface: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
};

// Work item type icons and colors
export const TYPE_ICONS = {
  [WORK_ITEM_TYPES.INITIATIVE]: { icon: 'fa-rocket', color: '#2D606F' },
  [WORK_ITEM_TYPES.EPIC]: { icon: 'fa-crown', color: '#E8B778' },
  [WORK_ITEM_TYPES.FEATURE]: { icon: 'fa-trophy', color: '#B8A5E8' },
  [WORK_ITEM_TYPES.USER_STORY]: { icon: 'fa-book-open', color: '#678C96' },
  [WORK_ITEM_TYPES.BUG]: { icon: 'fa-bug', color: '#EF4444' },
  [WORK_ITEM_TYPES.TASK]: { icon: 'fa-check-square', color: '#96B0B6' },
  [WORK_ITEM_TYPES.RISK]: { icon: 'fa-exclamation-triangle', color: '#F59E0B' }
};

// Default user roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

// API endpoints
export const API_ENDPOINTS = {
  INITIATIVES: '/api/initiatives',
  HEALTH: '/api/health'
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'oneview_auth_token',
  USER_DATA: 'oneview_user_data',
  PREFERENCES: 'oneview_preferences'
};