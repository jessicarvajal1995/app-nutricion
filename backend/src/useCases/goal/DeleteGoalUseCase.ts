import { IGoalRepository } from '../../repositories/IGoalRepository.js';

export class DeleteGoalUseCase {
  constructor(private goalRepository: IGoalRepository) {}

  async execute(id: string): Promise<boolean> {
    const existingGoal = await this.goalRepository.findById(id);
    if (!existingGoal) {
      return false; // Or throw new Error('Meta no encontrada para eliminar.');
    }
    // Add any other business logic before deletion if needed
    // For example, check if the goal is active and prevent deletion, or handle consequences.
    // For now, it directly deletes.
    return this.goalRepository.deleteById(id);
  }
} 