import { Request, Response } from 'express';
import { IGoalRepository, GoalCreationData, GoalUpdateData } from '../repositories/IGoalRepository.js';
import { CreateGoalUseCase } from '../useCases/goal/CreateGoalUseCase.js';
import { UpdateGoalUseCase } from '../useCases/goal/UpdateGoalUseCase.js';
import { DeleteGoalUseCase } from '../useCases/goal/DeleteGoalUseCase.js';
import { SetActiveGoalUseCase } from '../useCases/goal/SetActiveGoalUseCase.js';

export class GoalController {
  private createGoalUseCase: CreateGoalUseCase;
  private updateGoalUseCase: UpdateGoalUseCase;
  private deleteGoalUseCase: DeleteGoalUseCase;
  private setActiveGoalUseCase: SetActiveGoalUseCase;
  private goalRepository: IGoalRepository; // For direct find operations

  constructor(goalRepository: IGoalRepository) {
    this.goalRepository = goalRepository;
    this.createGoalUseCase = new CreateGoalUseCase(goalRepository);
    this.updateGoalUseCase = new UpdateGoalUseCase(goalRepository);
    this.deleteGoalUseCase = new DeleteGoalUseCase(goalRepository);
    this.setActiveGoalUseCase = new SetActiveGoalUseCase(goalRepository);
  }

  async createGoal(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as GoalCreationData;
      // Basic validation - extend with Zod or similar for production
      if (!data.userId || typeof data.targetWeight !== 'number' || data.targetWeight <= 0 ||
          typeof data.proteinGoal !== 'number' || data.proteinGoal < 0 ||
          typeof data.carbsGoal !== 'number' || data.carbsGoal < 0 ||
          typeof data.fatGoal !== 'number' || data.fatGoal < 0) {
        res.status(400).json({ error: 'Datos incompletos o inválidos para la meta.' });
        return;
      }
      const newGoal = await this.createGoalUseCase.execute(data);
      res.status(201).json(newGoal);
    } catch (error: any) {
      console.error('Error creating goal:', error);
      res.status(error.message.includes('mayor que cero') || error.message.includes('negativos') ? 400 : 500)
         .json({ error: error.message || 'Error interno del servidor.' });
    }
  }

  async getGoalById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const goal = await this.goalRepository.findById(id);
      if (!goal) {
        res.status(404).json({ error: 'Meta no encontrada.' });
        return;
      }
      res.status(200).json(goal);
    } catch (error: any) {
      console.error('Error fetching goal by ID:', error);
      res.status(500).json({ error: error.message || 'Error interno del servidor.' });
    }
  }

  async getGoalsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ error: 'UserID es requerido.' });
        return;
      }
      const goals = await this.goalRepository.findByUserId(userId);
      res.status(200).json(goals);
    } catch (error: any) {
      console.error('Error fetching goals by userID:', error);
      res.status(500).json({ error: error.message || 'Error interno del servidor.' });
    }
  }

  async getActiveGoalByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ error: 'UserID es requerido.' });
        return;
      }
      const activeGoal = await this.goalRepository.findActiveByUserId(userId);
      if (!activeGoal) {
        // This is not an error, it's a valid state (no active goal)
        res.status(200).json(null); // Or res.status(404).json({ message: 'No active goal found.' });
        return;
      }
      res.status(200).json(activeGoal);
    } catch (error: any) {
      console.error('Error fetching active goal by userID:', error);
      res.status(500).json({ error: error.message || 'Error interno del servidor.' });
    }
  }

  async updateGoal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body as GoalUpdateData;
      const updatedGoal = await this.updateGoalUseCase.execute(id, data);
      if (!updatedGoal) {
        res.status(404).json({ error: 'Meta no encontrada para actualizar o sin cambios.' });
        return;
      }
      res.status(200).json(updatedGoal);
    } catch (error: any) {
      console.error('Error updating goal:', error);
      res.status(error.message.includes('cero') || error.message.includes('negativo') || error.message.includes('proporcionaron datos') ? 400 : 500)
        .json({ error: error.message || 'Error interno del servidor.' });
    }
  }
  
  async setActiveGoal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body; // Expect userId in body for this operation for clarity

      if (!userId) {
        res.status(400).json({ error: 'UserID es requerido en el body para activar la meta.'});
        return;
      }

      const activatedGoal = await this.setActiveGoalUseCase.execute(id, userId);
      if (!activatedGoal) {
        // This might happen if the goal to activate wasn't found, or already active (though use case returns it)
        res.status(404).json({ error: 'No se pudo activar la meta o ya estaba activa.' });
        return;
      }
      res.status(200).json(activatedGoal);
    } catch (error: any) {
      console.error('Error setting active goal:', error);
       res.status(error.message.includes('encontrada') || error.message.includes('permiso') ? 404 : 500)
         .json({ error: error.message || 'Error interno del servidor.' });
    }
  }

  async deleteGoal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.deleteGoalUseCase.execute(id);
      if (!success) {
        res.status(404).json({ error: 'Meta no encontrada para eliminar.' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      res.status(500).json({ error: error.message || 'Error interno del servidor.' });
    }
  }
} 