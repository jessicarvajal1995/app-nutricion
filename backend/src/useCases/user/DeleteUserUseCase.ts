import { IUserRepository } from '../../repositories/IUserRepository.js';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<boolean> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      // Depending on desired behavior, you could return false or throw an error
      // For now, returning false if user doesn't exist to indicate deletion didn't happen for that ID.
      // Or throw new Error('User not found');
      return false;
    }
    return this.userRepository.deleteById(id);
  }
} 