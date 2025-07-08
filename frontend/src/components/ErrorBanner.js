import React from 'react';

const ErrorBanner = ({ error, onDismiss }) => {
  if (!error) return null;

  const getErrorIcon = (type) => {
    switch (type) {
      case 'network': return '🌐';
      case 'timeout': return '⏱️';
      case 'api_key': return '🔑';
      case 'rate_limit': return '🚫';
      case 'not_found': return '📍';
      default: return '⚠️';
    }
  };

  return (
    <div className="error-banner">
      <div className="error-content">
        <span className="error-icon">{getErrorIcon(error.type)}</span>
        <span className="error-message">{error.message}</span>
        <button className="error-dismiss" onClick={onDismiss}>×</button>
      </div>
    </div>
  );
};

export default ErrorBanner;