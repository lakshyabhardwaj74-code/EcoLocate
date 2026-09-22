import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<{ success: boolean; message?: string; user?: any; token?: string }>;
  adminLogin: (credentials: any) => Promise<{ success: boolean; message?: string; user?: any; token?: string }>;
  facilityLogin: (credentials: any) => Promise<{ success: boolean; message?: string; user?: any; token?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string; user?: any; token?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('ecocycle_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      const userData = res.user || res.data;
      if (res.success && userData) {
        setUser(userData);
      } else {
        localStorage.removeItem('ecocycle_token');
        setToken(null);
        setUser(null);
      }
    } catch {
      localStorage.removeItem('ecocycle_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    if (res.success && res.token) {
      localStorage.setItem('ecocycle_token', res.token);
      setToken(res.token);
      setUser(res.user || res.data);
    }
    return res;
  };

  const adminLogin = async (credentials: any) => {
    const res = await api.adminLogin(credentials);
    if (res.success && res.token) {
      localStorage.setItem('ecocycle_token', res.token);
      setToken(res.token);
      setUser(res.user || res.data);
    }
    return res;
  };

  const facilityLogin = async (credentials: any) => {
    const res = await api.facilityLogin(credentials);
    if (res.success && res.token) {
      localStorage.setItem('ecocycle_token', res.token);
      setToken(res.token);
      setUser(res.user || res.data);
    }
    return res;
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    if (res.success && res.token) {
      localStorage.setItem('ecocycle_token', res.token);
      setToken(res.token);
      setUser(res.user || res.data);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('ecocycle_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, adminLogin, facilityLogin, register, logout, refreshUser }}>
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
