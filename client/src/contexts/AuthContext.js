// client/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setAuthToken } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Save token to localStorage and set axios auth header
  const saveToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token);
      setToken(token);
    } else {
      localStorage.removeItem('token');
      setAuthToken(null);
      setToken('');
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await api.post('/api/auth/register', userData);
      saveToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await api.post('/api/auth/login', userData);
      saveToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  // Logout user
  const logout = () => {
    saveToken(null);
    setUser(null);
  };

  // Get current user
  const getCurrentUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.error('Get current user failed:', err);
      saveToken(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getCurrentUser();
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
