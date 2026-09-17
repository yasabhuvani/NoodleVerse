import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  isDemoUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = authService.getCurrentUser();
    if (existing) {
      setUser(existing);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const loggedIn = await authService.login(email, password);
    setUser(loggedIn);
    return loggedIn;
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    const newUser = await authService.register(name, email, password);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isDemoUser = user?.email === 'demo@noodleverse.com';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isDemoUser }}>
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
