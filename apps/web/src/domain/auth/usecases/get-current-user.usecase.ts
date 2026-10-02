import { User } from '../models/user.model.ts';
import { AuthRepository } from '../repositories/auth.repository.ts';

export class GetCurrentUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}
