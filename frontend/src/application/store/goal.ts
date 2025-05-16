import { defineStore } from 'pinia';
import type { NutritionalGoal } from '../../domain/entities/NutritionalGoal';
import { GoalService } from '../services/GoalService';


interface GoalState {
 goals: NutritionalGoal[];
 activeGoal: NutritionalGoal | null;
 loading: boolean;
 error: string | null;
}


export const useGoalStore = defineStore('goal', {
 state: (): GoalState => ({
   goals: [],
   activeGoal: null,
   loading: false,
   error: null,
 }),
  getters: {
   getGoals: (state) => state.goals,
   getActiveGoal: (state) => state.activeGoal,
 },
  actions: {
   async fetchGoalsByUserId(userId: string) {
     this.loading = true;
     this.error = null;
    
     try {
       const goalService = new GoalService();
       const goals = await goalService.getGoalsByUserId(userId);
       this.goals = goals;
      
       // Buscar la meta activa
       const activeGoal = goals.find(goal => goal.isActive);
       if (activeGoal) {
         this.activeGoal = activeGoal;
       }
      
       return goals;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al obtener las metas:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   async fetchActiveGoal(userId: string) {
     this.loading = true;
     this.error = null;
    
     try {
       const goalService = new GoalService();
       const activeGoal = await goalService.getActiveGoal(userId);
       this.activeGoal = activeGoal;
       return activeGoal;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al obtener la meta activa:', error);
       // Si no hay meta activa, no es necesariamente un error
       if (error instanceof Error && error.message.includes('404')) {
         this.activeGoal = null;
         return null;
       }
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   async createGoal(goalData: Omit<NutritionalGoal, 'id' | 'createdAt' | 'updatedAt'>) {
     this.loading = true;
     this.error = null;
    
     try {
       const goalService = new GoalService();
       const newGoal = await goalService.createGoal(goalData);
      
       // Si la nueva meta está activa, actualizar el estado
       if (newGoal.isActive) {
         // Desactivar la meta activa anterior
         this.goals = this.goals.map(goal => ({
           ...goal,
           isActive: false
         }));
        
         this.activeGoal = newGoal;
       }
      
       // Añadir la nueva meta a la lista
       this.goals.push(newGoal);
      
       return newGoal;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al crear la meta:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   async setActiveGoal(goalId: string, userId: string) {
     this.loading = true;
     this.error = null;
    
     try {
       const goalService = new GoalService();
       const activatedGoal = await goalService.setActiveGoal(goalId, userId);
      
       // Actualizar el estado
       this.goals = this.goals.map(goal => ({
         ...goal,
         isActive: goal.id === goalId
       }));
      
       this.activeGoal = activatedGoal;
      
       return activatedGoal;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al activar la meta:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   clearGoals() {
     this.goals = [];
     this.activeGoal = null;
   },
 },
});
