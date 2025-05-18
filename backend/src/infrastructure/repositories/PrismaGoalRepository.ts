import { PrismaClient, NutritionalGoal as PrismaNutritionalGoal, Prisma } from '@prisma/client';
import { NutritionalGoal } from '../../entities/NutritionalGoal.js';
import { IGoalRepository, GoalCreationData, GoalUpdateData } from '../../repositories/IGoalRepository.js';

export class PrismaGoalRepository implements IGoalRepository {
  constructor(private prisma: PrismaClient) {}

  private toDomain(prismaGoal: PrismaNutritionalGoal): NutritionalGoal {
    return new NutritionalGoal(
      prismaGoal.id,
      prismaGoal.userId,
      prismaGoal.targetWeight,
      prismaGoal.proteinGoal,
      prismaGoal.carbsGoal,
      prismaGoal.fatGoal,
      prismaGoal.isActive,
      prismaGoal.createdAt,
      prismaGoal.updatedAt
    );
  }

  async create(data: GoalCreationData): Promise<NutritionalGoal> {
    const prismaGoal = await this.prisma.nutritionalGoal.create({
      data: {
        ...data,
        // Prisma handles createdAt and updatedAt automatically
      },
    });
    return this.toDomain(prismaGoal);
  }

  async findById(id: string): Promise<NutritionalGoal | null> {
    const prismaGoal = await this.prisma.nutritionalGoal.findUnique({
      where: { id },
    });
    return prismaGoal ? this.toDomain(prismaGoal) : null;
  }

  async findAll(): Promise<NutritionalGoal[]> {
    const prismaGoals = await this.prisma.nutritionalGoal.findMany();
    return prismaGoals.map(this.toDomain);
  }

  async findByUserId(userId: string): Promise<NutritionalGoal[]> {
    const prismaGoals = await this.prisma.nutritionalGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Optional: order by creation date
    });
    return prismaGoals.map(this.toDomain);
  }

  async findActiveByUserId(userId: string): Promise<NutritionalGoal | null> {
    const prismaGoal = await this.prisma.nutritionalGoal.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });
    return prismaGoal ? this.toDomain(prismaGoal) : null;
  }

  async update(id: string, data: GoalUpdateData): Promise<NutritionalGoal | null> {
    try {
      // If isActive is being set to true, we might need to ensure other goals for the user are deactivated.
      // This logic is complex for a simple repository update and is better handled in a UseCase.
      // For now, this update method will just update the fields provided for the given goal ID.
      const prismaGoal = await this.prisma.nutritionalGoal.update({
        where: { id },
        data: {
          ...data,
          // Prisma handles updatedAt automatically
        },
      });
      return this.toDomain(prismaGoal);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null; // Record to update not found
      }
      throw error; // Re-throw other errors
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.prisma.nutritionalGoal.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false; // Record to delete not found
      }
      return false; // Or rethrow error for other cases
    }
  }
} 