import { Dish } from '../entities/Dish.js';

export interface DishCreationData extends Omit<Dish, 'id' | 'createdAt' | 'updatedAt'> {}
export interface DishUpdateData extends Partial<Omit<Dish, 'id' | 'createdAt' | 'updatedAt'>> {}

export interface IDishRepository {
    create(data: DishCreationData): Promise<Dish>;
    findById(id: string): Promise<Dish | null>;
    findAll(): Promise<Dish[]>;
    update(id: string, data: DishUpdateData): Promise<Dish | null>;
    deleteById(id: string): Promise<boolean>;
}
