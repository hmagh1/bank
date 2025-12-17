import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          setUser({
            username: decoded.sub,
            firstLogin: decoded.firstLogin,
            token: token,
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, firstLogin) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({
      username: decoded.sub,
      firstLogin: firstLogin,
      token: token,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateFirstLogin = (firstLogin) => {
    if (user) {
      setUser({ ...user, firstLogin });
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    updateFirstLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
