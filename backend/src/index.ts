import { NutritionalGoal } from './entities/NutritionalGoal';
import { IGoalRepository } from './repositories/IGoalRepository';


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
