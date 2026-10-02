import {
  LoginInput,
  LoginResponse,
  RegisterInput,
  MessageResponse,
  RefreshResponse,
  MeResponse,
} from 'shared';

export interface AuthApiInterface {
  login(data: LoginInput): Promise<LoginResponse>;
  register(data: RegisterInput): Promise<MessageResponse>;
  logout(): Promise<MessageResponse>;
  refresh(): Promise<RefreshResponse>;
  getMe(): Promise<MeResponse>;
}
