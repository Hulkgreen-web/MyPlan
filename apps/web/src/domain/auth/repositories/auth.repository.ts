import { User, LoginCredentials, RegisterParams, AuthSession } from '../models/user.model.ts';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(params: RegisterParams): Promise<void>;
  logout(): Promise<void>;
  refreshToken(): Promise<AuthSession | null>;
  getCurrentUser(): Promise<User | null>;
}
