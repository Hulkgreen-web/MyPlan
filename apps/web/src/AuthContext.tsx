import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials, RegisterParams } from '@domain/auth/models/user.model.ts';
import { useAuthUseCases } from '@/CompositionRoot.tsx';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginCredentials) => Promise<void>;
  register: (data: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loginUseCase, registerUseCase, logoutUseCase, refreshSessionUseCase } = useAuthUseCases();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await refreshSessionUseCase.execute();
        setUser(session ? session.user : null);
      } catch (err) {
        console.error('Auth initialization failed', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshSessionUseCase]);

  const login = async (data: LoginCredentials) => {
    const session = await loginUseCase.execute(data);
    setUser(session.user);
  };

  const register = async (data: RegisterParams) => {
    await registerUseCase.execute(data);
  };

  const logout = async () => {
    await logoutUseCase.execute();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
