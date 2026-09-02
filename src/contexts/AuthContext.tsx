import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  role: string;
  totalEarnings?: number;
  dailyEarnings?: number;
  suspended?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, age: number) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.get('/auth/me');
      if (data.user) {
        setUser({
          id: data.user._id || data.user.id,
          email: data.user.email,
          name: data.user.name,
          age: data.user.age,
          role: data.user.role,
          totalEarnings: data.user.totalEarnings,
          dailyEarnings: data.user.dailyEarnings,
          suspended: data.user.suspended,
          createdAt: data.user.createdAt,
        });
      }
    } catch {
      // Token invalid or expired
      api.setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const signUp = async (email: string, password: string, name: string, age: number) => {
    try {
      const data = await api.post('/auth/signup', { email, password, name, age });
      api.setToken(data.token);
      setUser({
        id: data.user.id || data.user._id,
        email: data.user.email,
        name: data.user.name,
        age: data.user.age,
        role: data.user.role,
        totalEarnings: data.user.totalEarnings || 0,
        dailyEarnings: data.user.dailyEarnings || 0,
        createdAt: data.user.createdAt,
      });
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      api.setToken(data.token);
      setUser({
        id: data.user.id || data.user._id,
        email: data.user.email,
        name: data.user.name,
        age: data.user.age,
        role: data.user.role,
        totalEarnings: data.user.totalEarnings || 0,
        dailyEarnings: data.user.dailyEarnings || 0,
        createdAt: data.user.createdAt,
      });
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    api.setToken(null);
    setUser(null);
  };

  const resetPassword = async (_email: string) => {
    // Password reset requires email service - placeholder for now
    return { error: 'Password reset is not yet configured. Please contact support.' };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};