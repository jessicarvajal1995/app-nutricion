import { defineStore } from 'pinia';
import type { User as DomainUser } from '../../domain/entities/User';
import { UserService } from '../services/UserService';

// Tipo para los datos que se envían al crear un usuario (sin id, createdAt, updatedAt)
export type UserCreationData = Omit<DomainUser, 'id' | 'createdAt' | 'updatedAt'>;
// Tipo para los datos que se envían al actualizar (id es opcional en el payload pero requerido en la URL)
// For the store action, we expect an object with id and the update data.
export type UserUpdatePayload = { id: string } & Partial<Omit<DomainUser, 'id' | 'createdAt' | 'updatedAt'>>;
// For the service, it will be just the data part.
export type UserUpdateData = Partial<Omit<DomainUser, 'id' | 'createdAt' | 'updatedAt'>>;

interface UserState {
  currentUser: DomainUser | null;
  users: DomainUser[]; // Array para almacenar la lista de usuarios
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

    async createUser(userData: UserCreationData): Promise<DomainUser | null> {
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

    async fetchUser(id: string): Promise<DomainUser | null> {
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

    async fetchAllUsers(): Promise<DomainUser[] | null> {
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

    async updateUser(payload: UserUpdatePayload): Promise<DomainUser | null> {
      this.loading = true;
      this.error = null;
      const { id, ...updateData } = payload;

      if (!id) {
        this.error = 'User ID is required for update.';
        console.error(this.error);
        this.loading = false;
        return null;
      }
      if (Object.keys(updateData).length === 0) {
        this.error = 'No update data provided.';
        console.warn(this.error);
        this.loading = false;
        return null; // Or handle as a no-op successfully
      }

      try {
        const updatedUser = await userService.updateUser(id, updateData);
        if (this.currentUser && this.currentUser.id === id) {
          // Ensure all fields are updated, spread new data over existing to keep any non-returned fields if necessary
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
    },

    async deleteUser(userId: string): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        await userService.deleteUser(userId);
        this.users = this.users.filter(u => u.id !== userId);
        if (this.currentUser && this.currentUser.id === userId) {
          this.currentUser = null;
        }
        return true;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || 'Error al eliminar el perfil.';
        this.error = errorMessage;
        console.error('Error en deleteUser (store):', errorMessage, error.response?.data || error);
        return false;
      } finally {
        this.loading = false;
      }
    }
  },
});

// También puedes exportar UserType si es útil en otros lugares, aunque User ya está exportada.
// export type { User as UserType };
