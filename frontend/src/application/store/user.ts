import { defineStore } from 'pinia';
import type { User } from '../../domain/entities/User';
import { UserService } from '../services/UserService';
import { ApiClient } from '../../infrastructure/api/ApiClient';

// Instancia de ApiClient. Si ApiClient.ts exporta una clase:
const apiClient = new ApiClient();
// Si ApiClient.ts exporta una instancia ya creada (ej. export default new ApiClient()):
// import apiClient from '../../infrastructure/api/ApiClient';

// Definición de la interfaz User (si no está definida en otro lugar e importada)
export interface User {
  id: string;
  name: string;
  age: number;
  height: number;
  currentWeight: number;
  createdAt: string; // O Date, dependiendo de la serialización de tu API
  updatedAt: string; // O Date
  // otros campos que pueda tener tu entidad User del backend
}

// Tipo para los datos que se envían al crear un usuario (sin id, createdAt, updatedAt)
export type UserCreationData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
// Tipo para los datos que se envían al actualizar (id es opcional en el payload pero requerido en la URL)
export type UserUpdateData = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

interface UserState {
  currentUser: User | null;
  users: User[]; // Array para almacenar la lista de usuarios
  loading: boolean;
  error: string | null;
}

// Instancia única del servicio.
const userService = new UserService();

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    users: [],
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    getUserProfile: (state) => state.currentUser,
    getAllUsersInStore: (state) => state.users,
  },
  actions: {
    clearError() {
      this.error = null;
    },

    clearUser() {
      this.currentUser = null;
    },

    async createUser(userData: UserCreationData): Promise<User | null> {
      this.loading = true;
      this.error = null;
      try {
        const newUser = await userService.createUser(userData);
        this.users.push(newUser); // Añadir a la lista del store
        return newUser; // Devolver para el componente
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || 'Error al crear el perfil.';
        this.error = errorMessage;
        console.error('Error en createUser (store):', errorMessage, error.response?.data || error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchUser(id: string): Promise<User | null> {
      this.loading = true;
      this.error = null;
      try {
        if (!id) {
          this.error = 'User ID is required to fetch.';
          return null;
        }
        const user = await userService.getUser(id);
        this.currentUser = user;
        return user;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || 'Error al obtener el usuario.';
        this.error = errorMessage;
        console.error('Error en fetchUser (store):', errorMessage, error.response?.data || error);
        this.currentUser = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchAllUsers(): Promise<User[] | null> {
      this.loading = true;
      this.error = null;
      try {
        const usersList = await userService.getAllUsers();
        this.users = usersList;
        return usersList;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || 'Error al obtener todos los usuarios.';
        this.error = errorMessage;
        console.error('Error en fetchAllUsers (store):', errorMessage, error.response?.data || error);
        this.users = [];
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(payload: { id: string } & UserUpdateData): Promise<User | null> {
      this.loading = true;
      this.error = null;
      const { id, ...updateData } = payload;

      if (!id) {
        this.error = 'User ID is required for update.';
        console.error(this.error);
        return null;
      }

      try {
        const updatedUser = await userService.updateUser(id, updateData);
        if (this.currentUser && this.currentUser.id === id) {
          this.currentUser = { ...this.currentUser, ...updatedUser };
        }
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...updatedUser };
        }
        return updatedUser;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || 'Error al actualizar el perfil.';
        this.error = errorMessage;
        console.error('Error en updateUser (store):', errorMessage, error.response?.data || error);
        return null;
      } finally {
        this.loading = false;
      }
    }
  },
});

// También puedes exportar UserType si es útil en otros lugares, aunque User ya está exportada.
// export type { User as UserType };
