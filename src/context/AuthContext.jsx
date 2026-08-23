import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('finance_user');
      return stored ? JSON.parse(stored) : INITIAL_USER;
    } catch (e) {
      return INITIAL_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('finance_token') || true; // Default true so user can immediately view everything
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('finance_user', JSON.stringify(user));
    }
  }, [user]);

  const login = (email, password) => {
    // Simulated authentication
    const fakeToken = 'jwt_token_' + Math.random().toString(36).substring(2);
    localStorage.setItem('finance_token', fakeToken);
    
    // If user has customized profile, keep it, otherwise update email
    setUser(prev => ({
      ...prev,
      email: email || prev.email,
    }));
    setIsAuthenticated(true);
    return { success: true };
  };

  const signup = (name, email, password, avatar) => {
    const fakeToken = 'jwt_token_' + Math.random().toString(36).substring(2);
    localStorage.setItem('finance_token', fakeToken);
    
    const newUser = {
      name: name || 'User',
      email: email || 'user@example.com',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'Member',
      currency: 'USD',
      monthlySavingsTarget: 2000,
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('finance_token');
    setIsAuthenticated(false);
  };

  const updateUserProfile = (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const guestLogin = () => {
    localStorage.setItem('finance_token', 'guest_token_demo');
    setUser(INITIAL_USER);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUserProfile,
        guestLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
