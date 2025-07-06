import React from 'react';

const DeviceRestriction = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '400px',
        background: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem',
          color: '#6b7280'
        }}>
          💻
        </div>
        
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          Desktop Only
        </h1>
        
        <p style={{
          color: '#6b7280',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          This HR Management System is designed for desktop and laptop computers only. 
          Please open this application on your PC for the best experience.
        </p>
        
        <div style={{
          background: '#f3f4f6',
          padding: '1rem',
          borderRadius: '0.375rem',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#4b5563'
          }}>
            <strong>Why desktop only?</strong><br />
            This application contains complex data management features that work best on larger screens.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeviceRestriction; 