import { NutritionalGoal } from '../entities/NutritionalGoal.js';
import { IGoalRepository } from '../repositories/IGoalRepository.js';
import { Request, Response } from 'express';
import { CreateUserUseCase } from '../useCases/user/CreateUserUseCase.js';
import { UpdateUserUseCase, UpdateUserDataDTO } from '../useCases/user/UpdateUserUseCase.js';
import { DeleteUserUseCase } from '../useCases/user/DeleteUserUseCase.js';
import { IUserRepository } from '../repositories/IUserRepository.js';
import { User } from '../entities/User.js';


interface CreateGoalDTO {
 userId: string;
 targetWeight: number;
 proteinGoal: number;
 carbsGoal: number;
 fatGoal: number;
 isActive: boolean;
}


export class CreateGoalUseCase {
 constructor(private goalRepository: IGoalRepository) {}


 async execute(data: CreateGoalDTO): Promise<NutritionalGoal> {
   // Validaciones de negocio
   if (data.targetWeight <= 0) {
     throw new Error('El peso objetivo debe ser mayor que cero');
   }
  
   if (data.proteinGoal < 0 || data.carbsGoal < 0 || data.fatGoal < 0) {
     throw new Error('Los objetivos nutricionales no pueden ser negativos');
   }


   // Si la nueva meta está activa, desactivamos las demás
   if (data.isActive) {
     const activeGoal = await this.goalRepository.findActiveByUserId(data.userId);
     if (activeGoal) {
       await this.goalRepository.update(activeGoal.id, { isActive: false });
     }
   }


   return this.goalRepository.create(data);
 }
}

// Define a type for the request body to ensure type safety
interface CreateUserRequestBody {
  name: string;
  age: number;
  height: number;
  currentWeight: number;
}

// Define a type for the update request body
// It's partial because not all fields need to be sent for an update
interface UpdateUserRequestBody extends Partial<CreateUserRequestBody> {}

export class UserController {
  private createUserUseCase: CreateUserUseCase;
  private updateUserUseCase: UpdateUserUseCase;
  private deleteUserUseCase: DeleteUserUseCase;
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.createUserUseCase = new CreateUserUseCase(userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, age, height, currentWeight } = req.body as CreateUserRequestBody;

      // Basic validation (can be extended with a library like Zod)
      if (!name || age === undefined || height === undefined || currentWeight === undefined) {
        res.status(400).json({ error: 'Missing required fields: name, age, height, currentWeight' });
        return;
      }
      
      // Type check for numbers, Express.json() might parse numbers from strings
      if (typeof age !== 'number' || typeof height !== 'number' || typeof currentWeight !== 'number') {
        res.status(400).json({ error: 'Fields age, height, currentWeight must be numbers.' });
        return;
      }

      const userData = { name, age, height, currentWeight };
      const newUser: User = await this.createUserUseCase.execute(userData);
      
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof Error) {
        // Check for specific use case errors if needed
        if (error.message.includes('La edad debe ser mayor que cero') || 
            error.message.includes('La altura debe ser mayor que cero') ||
            error.message.includes('El peso debe ser mayor que cero')) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Internal server error', details: error.message });
        }
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const user = await this.userRepository.findById(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userRepository.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching all users:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateUserDataDTO; // Cast to DTO

      if (!id) {
        res.status(400).json({ error: 'User ID is required for update' });
        return;
      }

      // Basic validation for empty body
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'Request body cannot be empty for update' });
        return;
      }
      
      // Type check for numbers if they exist in updateData
      if (updateData.age !== undefined && typeof updateData.age !== 'number') {
        res.status(400).json({ error: 'Field age must be a number.' });
        return;
      }
      if (updateData.height !== undefined && typeof updateData.height !== 'number') {
        res.status(400).json({ error: 'Field height must be a number.' });
        return;
      }
      if (updateData.currentWeight !== undefined && typeof updateData.currentWeight !== 'number') {
        res.status(400).json({ error: 'Field currentWeight must be a number.' });
        return;
      }

      const updatedUser = await this.updateUserUseCase.execute(id, updateData);

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found or no changes made' });
        return;
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      if (error instanceof Error) {
        if (error.message.includes('La edad debe ser mayor que cero') || 
            error.message.includes('La altura debe ser mayor que cero') ||
            error.message.includes('El peso debe ser mayor que cero')) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Internal server error', details: error.message });
        }
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async deleteUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'User ID is required for deletion' });
        return;
      }

      const success = await this.deleteUserUseCase.execute(id);

      if (!success) {
        res.status(404).json({ error: 'User not found or could not be deleted' });
        return;
      }

      res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
}
