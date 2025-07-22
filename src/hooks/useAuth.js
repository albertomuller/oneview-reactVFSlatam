import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated (from localStorage or session)
    const checkAuth = () => {
      const token = localStorage.getItem('oneview_auth_token');
      const userData = localStorage.getItem('oneview_user_data');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (password) => {
    // Simple authentication - in real app, this would be server-side
    const validUsers = {
      'admin': { name: 'Administrator', role: 'admin', email: 'admin@volvo.com' },
      'oneview2025': { name: 'OneView User', role: 'user', email: 'user@volvo.com' },
      'volvo123': { name: 'Volvo Manager', role: 'manager', email: 'manager@volvo.com' }
    };

    const userData = validUsers[password.toLowerCase()];
    
    if (userData) {
      const token = btoa(`${userData.email}:${Date.now()}`); // Simple token generation
      
      localStorage.setItem('oneview_auth_token', token);
      localStorage.setItem('oneview_user_data', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('oneview_auth_token');
    localStorage.removeItem('oneview_user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      'admin': ['admin', 'manager', 'user'],
      'manager': ['manager', 'user'],
      'user': ['user']
    };
    
    const userRoles = roleHierarchy[user.role] || [];
    return userRoles.includes(requiredRole);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    hasRole
  };
}