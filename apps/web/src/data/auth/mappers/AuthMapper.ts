import {
  UserResponse,
  LoginResponse,
  RefreshResponse,
  LoginInput,
  RegisterInput,
} from 'shared';
import {
  User,
  AuthSession,
  LoginCredentials,
  RegisterParams,
} from '@domain/auth/models/user.model.ts';

export class AuthMapper {
  static toDomainUser(dto: UserResponse): User {
    return User.create({
      id: dto.id,
      email: dto.email,
      name: dto.name,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    });
  }

  static toDomainSession(dto: LoginResponse | RefreshResponse): AuthSession {
    return {
      user: AuthMapper.toDomainUser(dto.user),
      accessToken: dto.accessToken,
    };
  }

  static toLoginDto(credentials: LoginCredentials): LoginInput {
    return {
      email: credentials.email,
      password: credentials.password,
    };
  }

  static toRegisterDto(params: RegisterParams): RegisterInput {
    return {
      name: params.name,
      email: params.email,
      password: params.password,
    };
  }
}
