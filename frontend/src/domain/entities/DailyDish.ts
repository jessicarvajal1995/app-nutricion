import type { Dish } from './Dish';


export interface DailyDish {
 id: string;
 dailyRecordId: string;
 dishId: string;
 dish?: Dish;
 grams: number;
 createdAt: string;
 updatedAt: string;
}
