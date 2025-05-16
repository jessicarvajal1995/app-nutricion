import { ApiClient } from '../../infrastructure/api/ApiClient';


interface User {
 id: string;
 name: string;
 age: number;
 height: number;
 currentWeight: number;
 createdAt: string;
 updatedAt: string;
}


export class UserService {
 private apiClient: ApiClient;
  constructor() {
   this.apiClient = new ApiClient();
 }
  async getUser(id: string): Promise<User> {
   return this.apiClient.get<User>(`/users/${id}`);
 }
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
   return this.apiClient.post<User>('/users', userData);
 }
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
   return this.apiClient.put<User>(`/users/${id}`, userData);
 }
  async deleteUser(id: string): Promise<void> {
   return this.apiClient.delete<void>(`/users/${id}`);
 }
  async getAllUsers(): Promise<User[]> {
   return this.apiClient.get<User[]>('/users');
 }
}
