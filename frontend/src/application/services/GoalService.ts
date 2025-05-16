import { ApiClient } from '../../infrastructure/api/ApiClient';
import type { NutritionalGoal } from '../../domain/entities/NutritionalGoal.ts';


export class GoalService {
 private apiClient: ApiClient;
  constructor() {
   this.apiClient = new ApiClient();
 }
  async getGoal(id: string): Promise<NutritionalGoal> {
   return this.apiClient.get<NutritionalGoal>(`/goals/${id}`);
 }
  async getGoalsByUserId(userId: string): Promise<NutritionalGoal[]> {
   return this.apiClient.get<NutritionalGoal[]>(`/goals/user/${userId}`);
 }
  async getActiveGoal(userId: string): Promise<NutritionalGoal> {
   return this.apiClient.get<NutritionalGoal>(`/goals/user/${userId}/active`);
 }
  async createGoal(goalData: Omit<NutritionalGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<NutritionalGoal> {
   return this.apiClient.post<NutritionalGoal>('/goals', goalData);
 }
  async updateGoal(id: string, goalData: Partial<NutritionalGoal>): Promise<NutritionalGoal> {
   return this.apiClient.put<NutritionalGoal>(`/goals/${id}`, goalData);
 }
  async setActiveGoal(id: string, userId: string): Promise<NutritionalGoal> {
   return this.apiClient.put<NutritionalGoal>(`/goals/${id}/activate`, { userId });
 }
  async deleteGoal(id: string): Promise<void> {
   return this.apiClient.delete<void>(`/goals/${id}`);
 }
}
