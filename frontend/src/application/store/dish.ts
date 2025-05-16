import { defineStore } from 'pinia';
import type { Dish } from '../../domain/entities/Dish';
import { DishService } from '../services/DishService';


interface DishState {
 dishes: Dish[];
 loading: boolean;
 error: string | null;
}


export const useDishStore = defineStore('dish', {
 state: (): DishState => ({
   dishes: [],
   loading: false,
   error: null,
 }),
  getters: {
   getAllDishes: (state) => state.dishes,
   getDishById: (state) => (id: string) => state.dishes.find(dish => dish.id === id),
 },
  actions: {
   async fetchAllDishes() {
     this.loading = true;
     this.error = null;
    
     try {
       const dishService = new DishService();
       const dishes = await dishService.getAllDishes();
       this.dishes = dishes;
       return dishes;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al obtener los platos:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   async createDish(dishData: Omit<Dish, 'id' | 'createdAt' | 'updatedAt'>) {
     this.loading = true;
     this.error = null;
    
     try {
       const dishService = new DishService();
       const newDish = await dishService.createDish(dishData);
       this.dishes.push(newDish);
       return newDish;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al crear el plato:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   async updateDish(id: string, dishData: Partial<Dish>) {
     this.loading = true;
     this.error = null;
    
     try {
       const dishService = new DishService();
       const updatedDish = await dishService.updateDish(id, dishData);
      
       // Actualizar el plato en la lista
       const index = this.dishes.findIndex(dish => dish.id === id);
       if (index !== -1) {
         this.dishes[index] = updatedDish;
       }
      
       return updatedDish;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al actualizar el plato:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   async deleteDish(id: string) {
     this.loading = true;
     this.error = null;
    
     try {
       const dishService = new DishService();
       await dishService.deleteDish(id);
      
       // Eliminar el plato de la lista
       this.dishes = this.dishes.filter(dish => dish.id !== id);
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al eliminar el plato:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
 },
});
