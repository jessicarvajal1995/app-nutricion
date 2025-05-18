import { Request, Response } from 'express';
import { IDishRepository, DishCreationData, DishUpdateData } from '../repositories/IDishRepository.js';
import { CreateDishUseCase } from '../useCases/dish/CreateDishUseCase.js';
import { UpdateDishUseCase } from '../useCases/dish/UpdateDishUseCase.js';
import { DeleteDishUseCase } from '../useCases/dish/DeleteDishUseCase.js';

export class DishController {
  private createDishUseCase: CreateDishUseCase;
  private updateDishUseCase: UpdateDishUseCase;
  private deleteDishUseCase: DeleteDishUseCase;
  // Direct repository access for simple find operations
  private dishRepository: IDishRepository;

  constructor(dishRepository: IDishRepository) {
    this.dishRepository = dishRepository;
    this.createDishUseCase = new CreateDishUseCase(dishRepository);
    this.updateDishUseCase = new UpdateDishUseCase(dishRepository);
    this.deleteDishUseCase = new DeleteDishUseCase(dishRepository);
  }

  async createDish(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as DishCreationData;
      // Add more robust validation here if needed (e.g., using Zod)
      if (!data.name || typeof data.proteinPer100g !== 'number' || typeof data.carbsPer100g !== 'number' || typeof data.fatsPer100g !== 'number') {
        res.status(400).json({ error: 'Datos incompletos o incorrectos para el plato.' });
        return;
      }
      const newDish = await this.createDishUseCase.execute(data);
      res.status(201).json(newDish);
    } catch (error: any) {
      console.error('Error creating dish:', error);
      res.status(error.message.includes('obligatorio') || error.message.includes('negativos') ? 400 : 500)
         .json({ error: error.message || 'Error interno del servidor.' });
    }
  }

  async getDishById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dish = await this.dishRepository.findById(id);
      if (!dish) {
        res.status(404).json({ error: 'Plato no encontrado.' });
        return;
      }
      res.status(200).json(dish);
    } catch (error: any) {
      console.error('Error fetching dish by ID:', error);
      res.status(500).json({ error: error.message || 'Error interno del servidor.' });
    }
  }

  async getAllDishes(req: Request, res: Response): Promise<void> {
    try {
      const dishes = await this.dishRepository.findAll();
      res.status(200).json(dishes);
    } catch (error: any) {
      console.error('Error fetching all dishes:', error);
      res.status(500).json({ error: error.message || 'Error interno del servidor.' });
    }
  }

  async updateDish(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body as DishUpdateData;
      // Add more robust validation here if needed
      if (Object.keys(data).length === 0) {
        res.status(400).json({ error: 'No se proporcionaron datos para actualizar.' });
        return;
      }
      const updatedDish = await this.updateDishUseCase.execute(id, data);
      if (!updatedDish) {
        res.status(404).json({ error: 'Plato no encontrado para actualizar o sin cambios.' });
        return;
      }
      res.status(200).json(updatedDish);
    } catch (error: any) {
      console.error('Error updating dish:', error);
      res.status(error.message.includes('vacío') || error.message.includes('negativ') || error.message.includes('proporcionaron datos') ? 400 : 500)
         .json({ error: error.message || 'Error interno del servidor.' });
    }
  }

  async deleteDish(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.deleteDishUseCase.execute(id);
      if (!success) {
        res.status(404).json({ error: 'Plato no encontrado para eliminar.' });
        return;
      }
      res.status(204).send(); // No content
    } catch (error: any) {
      console.error('Error deleting dish:', error);
      res.status(500).json({ error: error.message || 'Error interno del servidor.' });
    }
  }
} 