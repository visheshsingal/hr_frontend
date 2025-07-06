import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      background: '#1e293b',
      color: 'white',
      padding: '1rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            HR Management System
          </h1>
          <small style={{ opacity: 0.8 }}>
            {user?.role === 'hr' ? 'HR Portal' : 'Employee Portal'}
          </small>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span>Welcome, {user?.name}</span>
          <button 
            onClick={logout}
            className="btn btn-secondary"
            style={{ fontSize: '0.875rem' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 