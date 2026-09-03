import React, { createContext, useContext } from 'react';
import { useStore } from '../store/useStore';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const currentUser = useStore((s) => s.currentUser);
  const loginUser = useStore((s) => s.loginUser);
  const logoutUser = useStore((s) => s.logoutUser);

  const isAuthenticated = !!currentUser;

  const login = (email, password) => {
    return loginUser(email, password);
  };

  const logout = () => {
    logoutUser();
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
