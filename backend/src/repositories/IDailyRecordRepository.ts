import { DailyRecord } from '../entities/DailyRecord.js';
import { DailyDish } from '../entities/DailyDish.js';


export interface IDailyRecordRepository {
    findById(id: string): Promise<DailyRecord | null>;
    findByUserIdAndDate(userId: string, date: Date): Promise<DailyRecord | null>;
    findByUserId(userId: string): Promise<DailyRecord[]>;
    create(record: Omit<DailyRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyRecord>;
    addDish(dailyDish: Omit<DailyDish, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyDish>;
    getDishes(dailyRecordId: string): Promise<DailyDish[]>;
    removeDish(dailyDishId: string): Promise<void>;
    updateDish(id: string, grams: number): Promise<DailyDish>;
}
