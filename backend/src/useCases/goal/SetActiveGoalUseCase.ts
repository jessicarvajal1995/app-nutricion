import { NutritionalGoal } from '../../entities/NutritionalGoal.js';
import { IGoalRepository } from '../../repositories/IGoalRepository.js';

export class SetActiveGoalUseCase {
  constructor(private goalRepository: IGoalRepository) {}

  async execute(goalIdToActivate: string, userId: string): Promise<NutritionalGoal | null> {
    const goalToActivate = await this.goalRepository.findById(goalIdToActivate);

    if (!goalToActivate) {
      throw new Error('Meta a activar no encontrada.');
    }

    if (goalToActivate.userId !== userId) {
      // This should ideally not happen if requests are properly authenticated and authorized
      throw new Error('No tienes permiso para activar esta meta.');
    }

    if (goalToActivate.isActive) {
      return goalToActivate; // Already active, no change needed
    }

    // Deactivate any currently active goal for this user
    const currentActiveGoal = await this.goalRepository.findActiveByUserId(userId);
    if (currentActiveGoal && currentActiveGoal.id !== goalIdToActivate) {
      await this.goalRepository.update(currentActiveGoal.id, { isActive: false });
    }

    // Activate the new goal
    return this.goalRepository.update(goalIdToActivate, { isActive: true });
  }
} 