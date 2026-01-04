// frontend/src/auth/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import apiClient, { auth } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await auth.me(); // { success, data }
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

  // Global auto-logout on 401
  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("access_token");
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  // Initial auth restore
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetchMe();
  }, []);

  const login = async (payload) => {
    try {
      const res = await auth.login(payload); // { success, data }
      const token = res.data.token;

      localStorage.setItem("access_token", token);
      await fetchMe();

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Login failed",
      };
    }
  };

  const register = async (payload) => {
    try {
      const res = await auth.register(payload); // { success, data }
      const token = res.data.token;

      localStorage.setItem("access_token", token);
      await fetchMe();

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
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
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
