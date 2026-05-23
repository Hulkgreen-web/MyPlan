import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginInput, RegisterInput, AuthResponse } from 'shared';
import { apiFetch, setAccessToken } from './api.ts';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  loading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si on est déjà connecté au chargement
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Tenter de rafraîchir le token (si cookie présent côté navigateur)
        const res = await apiFetch('/auth/refresh', { method: 'POST' });
        
        if (res.ok) {
          const { accessToken, user } = await res.json();
          setAccessToken(accessToken);
          setUser(user);
        } else if (localStorage.getItem('accessToken')) {
          // 2. Si le refresh a échoué mais qu'on a un token en local, tenter de l'utiliser
          const userRes = await apiFetch('/auth/me');
          if (userRes.ok) {
            const { user } = await userRes.json();
            setUser(user);
          } else {
            setAccessToken(null); // Token local invalide
          }
        }
      } catch (err) {
        console.error("Auth init failed", err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (data: LoginInput) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Identifiants invalides');
    const { user, accessToken }: AuthResponse = await res.json();
    setAccessToken(accessToken);
    setUser(user);
  };

  const register = async (data: RegisterInput) => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de l'inscription");
  };

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    setAccessToken(null);
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
