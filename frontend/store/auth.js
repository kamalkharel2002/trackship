import React, { createContext, useContext, useState } from 'react';

/**
 * SIMPLE MOCK AUTH
 * Customer:    username "customer",    password "password123"
 * Transporter: username "transporter", password "password123"
 * Replace login() with real API later.
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  const login = async ({ role, username, password }) => {
    const ok =
      (role === 'customer' && username === 'customer' && password === 'password123') ||
      (role === 'transporter' && username === 'transporter' && password === 'password123');
    if (!ok) throw new Error('Invalid credentials.');
    setSession({ role, username });
  };

  const logout = () => setSession(null);
  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
