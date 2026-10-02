import { LoginCredentials, AuthSession } from '../models/user.model.ts';
import { AuthRepository } from '../repositories/auth.repository.ts';
import { UserEmail, UserPassword } from '../value-objects/index.ts';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthSession> {
    const email = new UserEmail(credentials.email);
    const password = new UserPassword(credentials.password);

    return this.authRepository.login({
      email: email.value,
      password: password.value,
    });
  }
}
