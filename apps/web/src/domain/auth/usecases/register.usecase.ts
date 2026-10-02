import { RegisterParams } from '../models/user.model.ts';
import { AuthRepository } from '../repositories/auth.repository.ts';
import { UserEmail, UserPassword, UserName } from '../value-objects/index.ts';

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: RegisterParams): Promise<void> {
    const name = new UserName(params.name);
    const email = new UserEmail(params.email);
    const password = new UserPassword(params.password);

    return this.authRepository.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
  }
}
