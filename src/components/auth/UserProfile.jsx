// src/pages/ProfileScreen.jsx - MINIMAL TEST VERSION

import React from 'react';

const ProfileScreen = ({ handleSignOut }) => {
  return (
    <div style={{
      padding: '20px',
      background: 'red',
      color: 'white',
      minHeight: '100vh',
      fontSize: '24px',
      textAlign: 'center'
    }}>
      <h1>🚨 MINIMAL PROFILE TEST 🚨</h1>
      <p>If you see this, the ProfileScreen file is working!</p>
      <p>File location: src/pages/ProfileScreen.jsx</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      
      <button 
        onClick={handleSignOut}
        style={{
          background: 'white',
          color: 'red',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Sign Out (Test)
      </button>
    </div>
  );
};

export default ProfileScreen;
