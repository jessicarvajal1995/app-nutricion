import { User } from '../entities/User.js';

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
    update(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null>;
    deleteById(id: string): Promise<boolean>;
}
