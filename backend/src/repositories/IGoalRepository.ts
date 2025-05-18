import { NutritionalGoal } from '../entities/NutritionalGoal.js';

// Data Transfer Object for creation, omits auto-generated fields
export interface GoalCreationData extends Omit<NutritionalGoal, 'id' | 'createdAt' | 'updatedAt'> {}
// Data Transfer Object for updates, allows partial updates, omits auto-generated fields
export interface GoalUpdateData extends Partial<Omit<NutritionalGoal, 'id' | 'createdAt' | 'updatedAt' | 'userId'>> {}
// UserId is typically not updatable directly, but can be part of other DTOs if needed for specific use cases

export interface IGoalRepository {
    create(data: GoalCreationData): Promise<NutritionalGoal>;
    findById(id: string): Promise<NutritionalGoal | null>;
    findAll(): Promise<NutritionalGoal[]>;
    findByUserId(userId: string): Promise<NutritionalGoal[]>;
    findActiveByUserId(userId: string): Promise<NutritionalGoal | null>;
    update(id: string, data: GoalUpdateData): Promise<NutritionalGoal | null>;
    deleteById(id: string): Promise<boolean>;
}
