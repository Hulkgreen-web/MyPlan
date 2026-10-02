import { AuthRepository as IAuthRepository } from '@domain/auth/repositories/auth.repository.ts';
import {
  User,
  LoginCredentials,
  RegisterParams,
  AuthSession,
} from '@domain/auth/models/user.model.ts';
import { AuthApiInterface } from '../api/AuthApiInterface.ts';
import { AuthMapper } from '../mappers/AuthMapper.ts';
import { setAccessToken } from '@/api.ts';

export class AuthRepository implements IAuthRepository {
  constructor(private readonly authApi: AuthApiInterface) {}

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const dto = AuthMapper.toLoginDto(credentials);
    const response = await this.authApi.login(dto);
    const session = AuthMapper.toDomainSession(response);
    setAccessToken(session.accessToken);
    return session;
  }

  async register(params: RegisterParams): Promise<void> {
    const dto = AuthMapper.toRegisterDto(params);
    await this.authApi.register(dto);
  }

  async logout(): Promise<void> {
    try {
      await this.authApi.logout();
    } finally {
      setAccessToken(null);
    }
  }

  async refreshToken(): Promise<AuthSession | null> {
    try {
      const response = await this.authApi.refresh();
      const session = AuthMapper.toDomainSession(response);
      setAccessToken(session.accessToken);
      return session;
    } catch {
      setAccessToken(null);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.authApi.getMe();
      return AuthMapper.toDomainUser(response.user);
    } catch {
      return null;
    }
  }
}
