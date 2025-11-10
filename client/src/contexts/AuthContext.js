import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create a "Provider" component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function
  const login = (userData) => {
    setUser(userData);
    // In a real app, you'd also save a token to localStorage
  };

  // Logout function
  const logout = () => {
    setUser(null);
    // In a real app, you'd remove the token
  };

  // The value that will be "provided" to all children
  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom "hook" to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};