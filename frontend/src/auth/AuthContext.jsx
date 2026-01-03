// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await apiClient.get("/auth/me");
      setUser(res.data);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem("access_token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchMe();
  }, []);

  const login = async (payload) => {
    try {
      const res = await apiClient.post("/auth/login", payload);
      localStorage.setItem("access_token", res.data.access_token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
      await fetchMe();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (payload) => {
    try {
      const res = await apiClient.post("/auth/register", payload);
      localStorage.setItem("access_token", res.data.access_token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
      await fetchMe();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
