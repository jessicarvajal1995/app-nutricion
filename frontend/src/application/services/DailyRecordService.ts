import { ApiClient } from '../../infrastructure/api/ApiClient';
import { DailyRecord } from '../../domain/entities/DailyRecord';
import { DailyDish } from '../../domain/entities/DailyDish';


export class DailyRecordService {
 private apiClient: ApiClient;
  constructor() {
   this.apiClient = new ApiClient();
 }
  async getDailyRecord(id: string): Promise<DailyRecord> {
   return this.apiClient.get<DailyRecord>(`/daily-records/${id}`);
 }
  async getDailyRecordByDate(userId: string, date: string): Promise<DailyRecord> {
   return this.apiClient.get<DailyRecord>(`/daily-records/user/${userId}/date/${date}`);
 }
  async getDailyRecordsByUserId(userId: string): Promise<DailyRecord[]> {
   return this.apiClient.get<DailyRecord[]>(`/daily-records/user/${userId}`);
 }
  async createDailyRecord(recordData: Omit<DailyRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyRecord> {
   return this.apiClient.post<DailyRecord>('/daily-records', recordData);
 }
  async addDishToDailyRecord(dailyDishData: Omit<DailyDish, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyDish> {
   return this.apiClient.post<DailyDish>('/daily-records/dish', dailyDishData);
 }
  async updateDailyDish(id: string, grams: number): Promise<DailyDish> {
   return this.apiClient.put<DailyDish>(`/daily-records/dish/${id}`, { grams });
 }
  async removeDishFromDailyRecord(dailyDishId: string): Promise<void> {
   return this.apiClient.delete<void>(`/daily-records/dish/${dailyDishId}`);
 }
  async getDailyDishes(dailyRecordId: string): Promise<DailyDish[]> {
   return this.apiClient.get<DailyDish[]>(`/daily-records/${dailyRecordId}/dishes`);
 }
}
