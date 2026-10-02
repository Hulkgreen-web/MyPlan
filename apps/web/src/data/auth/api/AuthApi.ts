import {
  LoginInput,
  LoginResponse,
  RegisterInput,
  MessageResponse,
  RefreshResponse,
  MeResponse,
} from 'shared';
import { AuthApiInterface } from './AuthApiInterface.ts';
import { apiFetch } from '@/api.ts';

export class AuthApi implements AuthApiInterface {
  async login(data: LoginInput): Promise<LoginResponse> {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Identifiants invalides');
    }
    return response.json();
  }

  async register(data: RegisterInput): Promise<MessageResponse> {
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Erreur lors de l'inscription");
    }
    return response.json();
  }

  async logout(): Promise<MessageResponse> {
    const response = await apiFetch('/auth/logout', { method: 'POST' });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Erreur lors de la déconnexion');
    }
    return response.json();
  }

  async refresh(): Promise<RefreshResponse> {
    const response = await apiFetch('/auth/refresh', { method: 'POST' });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Session expirée');
    }
    return response.json();
  }

  async getMe(): Promise<MeResponse> {
    const response = await apiFetch('/auth/me');
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Utilisateur non authentifié');
    }
    return response.json();
  }
}
