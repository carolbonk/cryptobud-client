import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { getAxiosConfig, setToken, removeToken, isAuthenticated as checkAuth } from '../utils/authUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await axios(getAxiosConfig('get', '/users/current'));
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      setUser(null);
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    return { user: null, posts: [], lastTopIndex: 0 };
  }, []);

  const login = useCallback((token) => {
    setToken(token);
  }, []);

  const isAuthenticated = useCallback(() => {
    return checkAuth();
  }, []);

  const value = {
    user,
    setUser,
    getCurrentUser,
    logout,
    login,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
