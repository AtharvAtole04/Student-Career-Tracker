import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/api/auth/me');
          if (res.data && res.data.success) {
            setUser(res.data.data);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Error loading current user:', error.message);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login action
  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token, ...userData } = res.data.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return res.data.data;
      }
      throw new Error('Login failed');
    } catch (error) {
      throw error;
    }
  };

  // Register action
  const register = async (name, email, password, role) => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password, role });
      if (res.data && res.data.success) {
        const { token, ...userData } = res.data.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return res.data.data;
      }
      throw new Error('Registration failed');
    } catch (error) {
      throw error;
    }
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
