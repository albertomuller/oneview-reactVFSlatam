import React from 'react';

// Volvo Brand Icon Component
// Replaces FontAwesome with clean, brand-consistent SVG icons
const VolvoIcon = ({ name, size = 20, color = 'currentColor', className = '' }) => {
  const icons = {
    // Navigation and UI
    'dashboard': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <rect x="3" y="3" width="7" height="7" strokeWidth="2" rx="1"/>
        <rect x="14" y="3" width="7" height="7" strokeWidth="2" rx="1"/>
        <rect x="14" y="14" width="7" height="7" strokeWidth="2" rx="1"/>
        <rect x="3" y="14" width="7" height="7" strokeWidth="2" rx="1"/>
      </svg>
    ),
    'chart-line': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
    'settings': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <circle cx="12" cy="12" r="3" strokeWidth="2"/>
        <path strokeWidth="2" d="M12 1v6m0 8v6m11-1a9 9 0 11-18 0 9 9 0 0118 0z"/>
        <path strokeWidth="2" d="M21 12h-6m-8 0H1"/>
      </svg>
    ),
    'user': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4" strokeWidth="2"/>
      </svg>
    ),
    'user-tie': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M12 11v6l-1 2h2l-1-2z"/>
      </svg>
    ),
    'building': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M3 21h18M5 21V7l8-4v18M13 9h4v12M9 9v1M9 12v1M9 15v1"/>
      </svg>
    ),
    'key': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <circle cx="8" cy="8" r="6" strokeWidth="2"/>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M21 21l-2.5-2.5M15 7l3 3L21 7"/>
      </svg>
    ),
    'shield': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M9 12l2 2 4-4"/>
      </svg>
    ),
    'eye': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <path strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3" strokeWidth="2"/>
      </svg>
    ),
    'eye-off': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'check-circle': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22,4 12,14.01 9,11.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'alert-triangle': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'info': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4"/>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8h.01"/>
      </svg>
    ),
    'calendar': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round"/>
        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round"/>
        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'clock': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
        <polyline points="12,6 12,12 16,14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'filter': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'search': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <circle cx="11" cy="11" r="8" strokeWidth="2"/>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
      </svg>
    ),
    'download': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
      </svg>
    ),
    'refresh': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <polyline points="23,4 23,10 17,10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="1,20 1,14 7,14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M20.49 9A9 9 0 005.64 5.64l-.35-.35M3.51 15a9 9 0 0014.85 3.36l.35.35"/>
      </svg>
    ),
    'spinner': (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
        </circle>
      </svg>
    ),
    'microsoft': (
      <svg viewBox="0 0 24 24" fill={color}>
        <rect x="3" y="3" width="8" height="8"/>
        <rect x="13" y="3" width="8" height="8"/>
        <rect x="3" y="13" width="8" height="8"/>
        <rect x="13" y="13" width="8" height="8"/>
      </svg>
    ),
    'project-diagram': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <rect x="2" y="3" width="6" height="6" rx="1" strokeWidth="2"/>
        <rect x="16" y="3" width="6" height="6" rx="1" strokeWidth="2"/>
        <rect x="9" y="15" width="6" height="6" rx="1" strokeWidth="2"/>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 6h8M12 9v6"/>
      </svg>
    ),
    'save': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
        <polyline points="17,21 17,13 7,13 7,21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="7,3 7,8 15,8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'plug': (
      <svg viewBox="0 0 24 24" fill="none" stroke={color}>
        <rect x="4" y="11" width="12" height="6" rx="2" strokeWidth="2"/>
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 7v4M10 7v4"/>
      </svg>
    )
  };

  const IconSVG = icons[name];
  
  if (!IconSVG) {
    console.warn(`VolvoIcon: Icon "${name}" not found`);
    return null;
  }

  return (
    <span 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {React.cloneElement(IconSVG, { width: size, height: size })}
    </span>
  );
};

export default VolvoIcon;
