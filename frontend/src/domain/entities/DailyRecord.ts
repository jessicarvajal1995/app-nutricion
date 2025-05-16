import type { DailyDish } from './DailyDish.ts';


export interface DailyRecord {
 id: string;
 userId: string;
 date: string;
 dailyDishes?: DailyDish[];
 createdAt: string;
 updatedAt: string;
}
