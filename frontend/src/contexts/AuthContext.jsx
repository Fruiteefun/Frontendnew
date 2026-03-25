import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, userApi, saveTokens, clearTokens, getToken } from "../lib/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    try {
      const res = await userApi.getMe();
      if (res.success) {
        setUser(res.data);
        localStorage.setItem("userRole", res.data.role);
      }
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success) {
      saveTokens(res.data.access_token, res.data.refresh_token);
      localStorage.setItem("userRole", res.data.role);
      setUser(res.data);
    }
    return res;
  };

  const register = async (email, password, role) => {
    const fn = role === "influencer" ? authApi.registerInfluencer : authApi.registerBusiness;
    const res = await fn(email, password);
    if (res.success) {
      saveTokens(res.data.access_token, res.data.refresh_token);
      localStorage.setItem("userRole", res.data.role);
      setUser(res.data);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    clearTokens();
    setUser(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("fruitee_influencer_registered");
    localStorage.removeItem("fruitee_influencer_progress");
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
