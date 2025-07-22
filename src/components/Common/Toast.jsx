import React, { useEffect, useState } from 'react';

const Toast = ({ type = 'info', message, duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          onClose && onClose();
        }, 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          icon: 'fa-check-circle'
        };
      case 'error':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          icon: 'fa-exclamation-circle'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-500',
          textColor: 'text-white',
          icon: 'fa-exclamation-triangle'
        };
      default:
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          icon: 'fa-info-circle'
        };
    }
  };

  const { bgColor, textColor, icon } = getToastConfig(type);

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-80 max-w-96`}>
        <i className={`fas ${icon} text-lg`}></i>
        <span className="flex-1 text-sm font-medium">
          {message}
        </span>
        {onClose && (
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 focus:outline-none transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;