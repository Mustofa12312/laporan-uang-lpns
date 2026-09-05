import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { loginUser, logoutUser } from '../services/auth.service';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ uid: user.uid, email: user.email, ...userDoc.data() });
          } else {
            // Fallback if document doesn't exist yet
            setCurrentUser({ uid: user.uid, email: user.email, name: user.displayName || 'User', role: 'UNKNOWN' });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser({ uid: user.uid, email: user.email });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const result = await loginUser(email, password);
    if (!result.success) {
      throw new Error(result.error || "Email atau password salah");
    }
    return result;
  };

  const logout = async () => {
    await logoutUser();
  };

  const isAuthenticated = !!currentUser;

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Memuat...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

