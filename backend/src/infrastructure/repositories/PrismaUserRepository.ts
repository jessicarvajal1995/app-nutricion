import { PrismaClient } from '@prisma/client';
import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';


export class PrismaUserRepository implements IUserRepository {
 constructor(private prisma: PrismaClient) {}


 async findById(id: string): Promise<User | null> {
   const user = await this.prisma.user.findUnique({
     where: { id }
   });
  
   return user ? new User(
     user.id,
     user.name,
     user.age,
     user.height,
     user.currentWeight,
     user.createdAt,
     user.updatedAt
   ) : null;
 }


 async findAll(): Promise<User[]> {
   const users = await this.prisma.user.findMany();
  
   return users.map(user => new User(
     user.id,
     user.name,
     user.age,
     user.height,
     user.currentWeight,
     user.createdAt,
     user.updatedAt
   ));
 }


 async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
   const user = await this.prisma.user.create({
     data: userData
   });
  
   return new User(
     user.id,
     user.name,
     user.age,
     user.height,
     user.currentWeight,
     user.createdAt,
     user.updatedAt
   );
 }


 async update(id: string, userData: Partial<User>): Promise<User> {
   const user = await this.prisma.user.update({
     where: { id },
     data: userData
   });
  
   return new User(
     user.id,
     user.name,
     user.age,
     user.height,
     user.currentWeight,
     user.createdAt,
     user.updatedAt
   );
 }


 async delete(id: string): Promise<void> {
   await this.prisma.user.delete({
     where: { id }
   });
 }
}
