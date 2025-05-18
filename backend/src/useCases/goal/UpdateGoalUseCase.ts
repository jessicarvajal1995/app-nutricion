import { NutritionalGoal } from '../../entities/NutritionalGoal.js';
import { IGoalRepository, GoalUpdateData } from '../../repositories/IGoalRepository.js';

export class UpdateGoalUseCase {
  constructor(private goalRepository: IGoalRepository) {}

  async execute(id: string, data: GoalUpdateData): Promise<NutritionalGoal | null> {
    if (Object.keys(data).length === 0) {
      throw new Error('No se proporcionaron datos para actualizar la meta.');
    }

    // Basic validation for provided fields (can be extended)
    if (data.targetWeight !== undefined && data.targetWeight <= 0) {
      throw new Error('El peso objetivo debe ser mayor que cero.');
    }
    if (data.proteinGoal !== undefined && data.proteinGoal < 0) {
      throw new Error('El objetivo de proteínas no puede ser negativo.');
    }
    if (data.carbsGoal !== undefined && data.carbsGoal < 0) {
      throw new Error('El objetivo de carbohidratos no puede ser negativo.');
    }
    if (data.fatGoal !== undefined && data.fatGoal < 0) {
      throw new Error('El objetivo de grasas no puede ser negativo.');
    }

    // Note: If 'isActive' is part of 'data', this use case doesn't automatically handle
    // deactivating other active goals. That logic should be in a dedicated SetActiveGoalUseCase
    // or handled carefully by the caller if using this generic update.

    const existingGoal = await this.goalRepository.findById(id);
    if (!existingGoal) {
      return null; // Or throw new Error('Meta no encontrada para actualizar.');
    }
    
    // Prevent changing userId via this generic update
    if ('userId' in data) {
        delete (data as any).userId;
    }

    return this.goalRepository.update(id, data);
  }
} 