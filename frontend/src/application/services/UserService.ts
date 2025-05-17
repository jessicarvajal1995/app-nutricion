import { ApiClient } from '../../infrastructure/api/ApiClient';
import type { User, UserCreationData, UserUpdateData } from '../store/user';

const apiClient = new ApiClient();

export class UserService {
  async getUser(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  }

  async createUser(userData: UserCreationData): Promise<User> {
    return apiClient.post<User>('/users', userData);
  }

  async updateUser(id: string, userData: UserUpdateData): Promise<User> {
    return apiClient.put<User>(`/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(`/users/${id}`);
  }

  async getAllUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/users');
  }
}
