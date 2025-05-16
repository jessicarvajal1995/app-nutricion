import { Dish } from '../entities/Dish';


export interface IDishRepository {
    findById(id: string): Promise<Dish | null>;
    findAll(): Promise<Dish[]>;
    create(dish: Omit<Dish, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dish>;
    update(id: string, dish: Partial<Dish>): Promise<Dish>;
    delete(id: string): Promise<void>;
}
