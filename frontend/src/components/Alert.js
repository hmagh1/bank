import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`} style={{ position: 'relative' }}>
      {message}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            opacity: 0.5,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
