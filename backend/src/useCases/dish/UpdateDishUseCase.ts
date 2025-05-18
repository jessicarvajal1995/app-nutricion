import { Dish } from '../../entities/Dish.js';
import { IDishRepository, DishUpdateData } from '../../repositories/IDishRepository.js';

export class UpdateDishUseCase {
  constructor(private dishRepository: IDishRepository) {}

  async execute(id: string, data: DishUpdateData): Promise<Dish | null> {
    if (Object.keys(data).length === 0) {
      throw new Error('No se proporcionaron datos para actualizar.');
    }
    // Basic validation for provided fields (can be extended)
    if (data.name !== undefined && data.name.trim() === '') {
      throw new Error('El nombre del plato no puede estar vacío.');
    }
    if (data.proteinPer100g !== undefined && data.proteinPer100g < 0) {
      throw new Error('Las proteínas no pueden ser negativas.');
    }
    if (data.carbsPer100g !== undefined && data.carbsPer100g < 0) {
      throw new Error('Los carbohidratos no pueden ser negativos.');
    }
    if (data.fatsPer100g !== undefined && data.fatsPer100g < 0) {
      throw new Error('Las grasas no pueden ser negativas.');
    }

    const existingDish = await this.dishRepository.findById(id);
    if (!existingDish) {
      return null; // Or throw new Error('Plato no encontrado para actualizar.');
    }

    return this.dishRepository.update(id, data);
  }
} 