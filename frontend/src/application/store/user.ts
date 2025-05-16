import { defineStore } from 'pinia';
import type { User } from '../../domain/entities/User';
import { UserService } from '../services/UserService';


interface UserState {
 currentUser: User | null;
 loading: boolean;
 error: string | null;
}


export const useUserStore = defineStore('user', {
 state: (): UserState => ({
   currentUser: null,
   loading: false,
   error: null,
 }),
  getters: {
   isAuthenticated: (state) => !!state.currentUser,
   getUserProfile: (state) => state.currentUser,
 },
  actions: {
   async fetchUser(id: string) {
     this.loading = true;
     this.error = null;
    
     try {
       const userService = new UserService();
       const user = await userService.getUser(id);
       this.currentUser = user;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al obtener el usuario:', error);
     } finally {
       this.loading = false;
     }
   },
  
   async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
     this.loading = true;
     this.error = null;
    
     try {
       const userService = new UserService();
       const user = await userService.createUser(userData);
       this.currentUser = user;
       return user;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al crear el usuario:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   async updateUser(userData: Partial<User>) {
     if (!this.currentUser) return;
    
     this.loading = true;
     this.error = null;
    
     try {
       const userService = new UserService();
       const updatedUser = await userService.updateUser(this.currentUser.id, userData);
       this.currentUser = updatedUser;
       return updatedUser;
     } catch (error) {
       this.error = error instanceof Error ? error.message : 'Error desconocido';
       console.error('Error al actualizar el usuario:', error);
       throw error;
     } finally {
       this.loading = false;
     }
   },
  
   clearUser() {
     this.currentUser = null;
   },
 },
});
