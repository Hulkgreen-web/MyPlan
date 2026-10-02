import { AuthSession } from '../models/user.model.ts';
import { AuthRepository } from '../repositories/auth.repository.ts';

export class RefreshSessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<AuthSession | null> {
    return this.authRepository.refreshToken();
  }
}
