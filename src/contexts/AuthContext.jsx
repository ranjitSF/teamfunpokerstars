import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { syncPlayer } from '../services';
import { isDemoMode, adminEmail } from '../config/app';

const AuthContext = createContext();

// Demo data
const demoPlayer = {
  id: 1,
  name: 'Demo Player',
  email: 'demo@example.com',
  firebase_uid: 'demo-uid',
};

const demoUser = {
  uid: 'demo-uid',
  email: 'demo@example.com',
  displayName: 'Demo Player'
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(isDemoMode ? demoUser : null);
  const [player, setPlayer] = useState(isDemoMode ? demoPlayer : null);
  const [loading, setLoading] = useState(!isDemoMode);
  const [authToken, setAuthToken] = useState(isDemoMode ? 'demo-token' : null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Skip Firebase auth in demo mode
    if (isDemoMode) {
      setIsAdmin(true); // In demo mode, user is admin
      return;
    }

    // Check if user is completing sign-in via email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          // Auth state change will be handled by onAuthStateChanged
        })
        .catch((error) => {
          console.error('Error signing in with email link:', error);
        });
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const token = await user.getIdToken();
          setAuthToken(token);

          // Check if user is admin
          setIsAdmin(user.email === adminEmail);

          // Sync player data with backend
          const playerData = await syncPlayer({
            firebase_uid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            phone: user.phoneNumber || null,
          }, token);

          setPlayer(playerData);
        } catch (error) {
          console.error('Error syncing player:', error);
        }
      } else {
        setAuthToken(null);
        setPlayer(null);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const sendSignInLink = async (email) => {
    if (isDemoMode) {
      // In demo mode, just pretend to send the link
      return Promise.resolve();
    }

    const actionCodeSettings = {
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    };

    return sendSignInLinkToEmail(auth, email, actionCodeSettings);
  };

  const signOut = async () => {
    if (isDemoMode) {
      // In demo mode, don't actually sign out
      console.log('Demo mode - sign out disabled');
      return;
    }
    await firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    player,
    authToken,
    isAdmin,
    sendSignInLink,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
