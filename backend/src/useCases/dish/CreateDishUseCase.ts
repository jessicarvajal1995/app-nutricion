import { Dish } from '../../entities/Dish.js';
import { IDishRepository, DishCreationData } from '../../repositories/IDishRepository.js';

export class CreateDishUseCase {
  constructor(private dishRepository: IDishRepository) {}

  async execute(data: DishCreationData): Promise<Dish> {
    // Basic validation (can be extended with a library like Zod)
    if (!data.name || data.name.trim() === '') {
      throw new Error('El nombre del plato es obligatorio.');
    }
    if (data.proteinPer100g < 0 || data.carbsPer100g < 0 || data.fatsPer100g < 0) {
      throw new Error('Los valores nutricionales no pueden ser negativos.');
    }
    // Add more specific business logic if needed
    return this.dishRepository.create(data);
  }
} 