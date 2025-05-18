import { PrismaClient, User as PrismaUser, Prisma } from '@prisma/client';
import { User } from '../../entities/User.js';
import { IUserRepository } from '../../repositories/IUserRepository.js';


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
  
   return users.map((user: PrismaUser) => new User(
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

 async deleteById(id: string): Promise<boolean> {
   try {
     await this.prisma.user.delete({
       where: { id }
     });
     return true;
   } catch (error) {
     // Prisma throws an error if the record to delete is not found (P2025)
     // You can check for specific Prisma error codes if needed
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
       return false; // Record to delete not found
     }
     // For other errors, rethrow or handle as appropriate
     // console.error("Error deleting user:", error);
     // throw error; 
     return false; // Or rethrow, depending on desired error handling for other cases
   }
 }
}
