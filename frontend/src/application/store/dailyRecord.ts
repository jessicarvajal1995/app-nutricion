import { defineStore } from 'pinia';
import type { DailyRecord } from '../../domain/entities/DailyRecord.ts';
import type { DailyDish } from '../../domain/entities/DailyDish.ts';
import { DailyRecordService } from '../services/DailyRecordService';


interface DailyRecordState {
 dailyRecords: DailyRecord[];
 currentDailyRecord: DailyRecord | null;
 loading: boolean;
 error: string | null;
}


export const useDailyRecordStore = defineStore('dailyRecord', {
 state: (): DailyRecordState => ({
   dailyRecords: [],
   currentDailyRecord: null,
   loading: false,
   error: null,
 }),
  getters: {
   getDailyRecords: (state) => state.dailyRecords,
   getCurrentDailyRecord: (state) => state.currentDailyRecord,
   getDailyDishes: (state) => state.currentDailyRecord?.dailyDishes || [],
 },
  actions: {
   async fetchDailyRecordsByUserId(userId: string) {
     this.loading = true;
     this.error = null;
    
     try {
       const dailyRecordService = new DailyRecordService();
       const dailyRecords = await dailyRecordService.getDailyRecordsByUserId(userId);
       this.dailyRecords = dailyRecords;
       return dailyRecords;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al obtener los registros diarios:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   async fetchDailyRecordByDate(userId: string, date: string) {
     this.loading = true;
     this.error = null;
    
     try {
       const dailyRecordService = new DailyRecordService();
      
       try {
         // Intentar obtener el registro existente
         const dailyRecord = await dailyRecordService.getDailyRecordByDate(userId, date);
         this.currentDailyRecord = dailyRecord;
         return dailyRecord;
       } catch (error) {
         // Si no existe, crear uno nuevo
         if (error instanceof Error && error.message.includes('404')) {
           const newRecord = await dailyRecordService.createDailyRecord({
             userId,
             date
           });
          
           this.currentDailyRecord = {
             ...newRecord,
             dailyDishes: []
           };
          
           return this.currentDailyRecord;
         }
        
         throw error;
       }
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al obtener el registro diario:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   async addDishToDailyRecord(dailyDishData: Omit<DailyDish, 'id' | 'createdAt' | 'updatedAt'>) {
     this.loading = true;
     this.error = null;
    
     try {
       const dailyRecordService = new DailyRecordService();
       const newDailyDish = await dailyRecordService.addDishToDailyRecord(dailyDishData);
      
       // Actualizar el estado
       if (this.currentDailyRecord) {
         if (!this.currentDailyRecord.dailyDishes) {
           this.currentDailyRecord.dailyDishes = [];
         }
        
         this.currentDailyRecord.dailyDishes.push(newDailyDish);
       }
      
       return newDailyDish;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al añadir el plato al registro diario:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   async updateDailyDish(id: string, grams: number) {
     this.loading = true;
     this.error = null;
    
     try {
       const dailyRecordService = new DailyRecordService();
       const updatedDailyDish = await dailyRecordService.updateDailyDish(id, grams);
      
       // Actualizar el estado
       if (this.currentDailyRecord && this.currentDailyRecord.dailyDishes) {
         const index = this.currentDailyRecord.dailyDishes.findIndex(dish => dish.id === id);
         if (index !== -1) {
           this.currentDailyRecord.dailyDishes[index] = updatedDailyDish;
         }
       }
      
       return updatedDailyDish;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al actualizar el plato del registro diario:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   async removeDishFromDailyRecord(dailyDishId: string) {
     this.loading = true;
     this.error = null;
    
     try {
       const dailyRecordService = new DailyRecordService();
       await dailyRecordService.removeDishFromDailyRecord(dailyDishId);
      
       // Actualizar el estado
       if (this.currentDailyRecord && this.currentDailyRecord.dailyDishes) {
         this.currentDailyRecord.dailyDishes = this.currentDailyRecord.dailyDishes.filter(
           dish => dish.id !== dailyDishId
         );
       }
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al eliminar el plato del registro diario:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   clearDailyRecords() {
     this.dailyRecords = [];
     this.currentDailyRecord = null;
   },
 },
});
