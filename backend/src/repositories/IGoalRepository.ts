import { NutritionalGoal } from '../entities/NutritionalGoal';


export interface IGoalRepository {
    findById(id: string): Promise<NutritionalGoal | null>;
    findByUserId(userId: string): Promise<NutritionalGoal[]>;
    findActiveByUserId(userId: string): Promise<NutritionalGoal | null>;
    create(goal: Omit<NutritionalGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<NutritionalGoal>;
    update(id: string, goal: Partial<NutritionalGoal>): Promise<NutritionalGoal>;
    setActive(id: string, userId: string): Promise<NutritionalGoal>;
    delete(id: string): Promise<void>;
}
