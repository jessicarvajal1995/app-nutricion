import { User } from '../../entities/User.js';
import { IUserRepository } from '../../repositories/IUserRepository.js';

export interface UpdateUserDataDTO extends Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> {
  // DTO can include specific validation rules or transformations if needed
  // For now, it directly uses a partial of the User entity (excluding restricted fields)
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDataDTO): Promise<User | null> {
    // Add any specific business validation for updating here
    // For example, checking if age, height, weight are positive if provided
    if (data.age !== undefined && data.age <= 0) {
      throw new Error('La edad debe ser mayor que cero');
    }
    if (data.height !== undefined && data.height <= 0) {
      throw new Error('La altura debe ser mayor que cero');
    }
    if (data.currentWeight !== undefined && data.currentWeight <= 0) {
      throw new Error('El peso debe ser mayor que cero');
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      return null; // Or throw a new Error('User not found');
    }

    return this.userRepository.update(id, data);
  }
} 