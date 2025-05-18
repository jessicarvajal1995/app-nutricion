import { IDishRepository } from '../../repositories/IDishRepository.js';

export class DeleteDishUseCase {
  constructor(private dishRepository: IDishRepository) {}

  async execute(id: string): Promise<boolean> {
    const existingDish = await this.dishRepository.findById(id);
    if (!existingDish) {
      return false; // Or throw new Error('Plato no encontrado para eliminar.');
    }
    return this.dishRepository.deleteById(id);
  }
} 