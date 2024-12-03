import React, { createContext, useContext, useEffect, useState } from 'react';
import { pb } from './pocketbase';
import { useToast } from './hooks/useToast';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(pb.authStore.model);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    setUser(pb.authStore.model);
    setIsLoading(false);

    pb.authStore.onChange((token, model) => {
      setUser(model);
    });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password);
      addToast('Successfully logged in', 'success');
    } catch (error) {
      addToast('Invalid email or password', 'error');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const data = {
        email,
        password,
        passwordConfirm: password,
        name,
      };
      await pb.collection('users').create(data);
      await login(email, password);
      addToast('Account created successfully', 'success');
    } catch (error) {
      addToast('Failed to create account', 'error');
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    addToast('Successfully logged out', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
