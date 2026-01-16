import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo data for preview mode
const demoPlayer = {
  id: 1,
  name: 'Demo Player',
  email: 'demo@example.com',
  firebase_uid: 'demo-uid',
};

const demoToken = 'demo-token';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    uid: 'demo-uid',
    email: 'demo@example.com',
    displayName: 'Demo Player'
  });
  const [player, setPlayer] = useState(demoPlayer);
  const [authToken, setAuthToken] = useState(demoToken);
  const [loading, setLoading] = useState(false);

  const signIn = async (email, password) => {
    // Demo mode - just set the user
    setCurrentUser({
      uid: 'demo-uid',
      email: email,
      displayName: email.split('@')[0]
    });
    return Promise.resolve();
  };

  const signUp = async (email, password, name) => {
    // Demo mode - just set the user
    setCurrentUser({
      uid: 'demo-uid',
      email: email,
      displayName: name
    });
    return Promise.resolve();
  };

  const signOut = async () => {
    // In demo mode, don't actually sign out
    console.log('Demo mode - sign out disabled');
  };

  const value = {
    currentUser,
    player,
    authToken,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
