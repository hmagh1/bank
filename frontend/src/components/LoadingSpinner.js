import React from 'react';

const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '3rem',
      color: '#666'
    }}>
      <div className="spinner" style={{ width: '40px', height: '40px', marginBottom: '1rem' }}></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
