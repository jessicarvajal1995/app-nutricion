import { PrismaClient, Dish as PrismaDish, Prisma } from '@prisma/client';
import { Dish } from '../../entities/Dish.js';
import { IDishRepository, DishCreationData, DishUpdateData } from '../../repositories/IDishRepository.js';

export class PrismaDishRepository implements IDishRepository {
  constructor(private prisma: PrismaClient) {}

  private toDomain(prismaDish: PrismaDish): Dish {
    return new Dish(
      prismaDish.id,
      prismaDish.name,
      prismaDish.proteinPer100g,
      prismaDish.carbsPer100g,
      prismaDish.fatsPer100g,
      prismaDish.createdAt,
      prismaDish.updatedAt
    );
  }

  async create(data: DishCreationData): Promise<Dish> {
    const prismaDish = await this.prisma.dish.create({
      data: {
        ...data,
        // Prisma handles createdAt and updatedAt automatically
      },
    });
    return this.toDomain(prismaDish);
  }

  async findById(id: string): Promise<Dish | null> {
    const prismaDish = await this.prisma.dish.findUnique({
      where: { id },
    });
    return prismaDish ? this.toDomain(prismaDish) : null;
  }

  async findAll(): Promise<Dish[]> {
    const prismaDishes = await this.prisma.dish.findMany();
    return prismaDishes.map(this.toDomain);
  }

  async update(id: string, data: DishUpdateData): Promise<Dish | null> {
    try {
      const prismaDish = await this.prisma.dish.update({
        where: { id },
        data: {
          ...data,
          // Prisma handles updatedAt automatically
        },
      });
      return this.toDomain(prismaDish);
    } catch (error) {
      // Handle cases where the dish to update is not found (e.g., Prisma's P2025 error)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error; // Re-throw other errors
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.prisma.dish.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false; // Record to delete not found
      }
      // For other errors, you might want to log them or handle them differently
      return false; // Or rethrow error;
    }
  }
} 