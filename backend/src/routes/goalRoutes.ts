import { Router } from 'express';
import { GoalController } from '../controllers/GoalController.js';
import { PrismaClient } from '@prisma/client';
import { PrismaGoalRepository } from '../infrastructure/repositories/PrismaGoalRepository.js';

const router = Router();

// Initialize dependencies
const prisma = new PrismaClient();
const goalRepository = new PrismaGoalRepository(prisma);
const goalController = new GoalController(goalRepository);

// POST /api/goals - Create a new goal
router.post('/', (req, res) => goalController.createGoal(req, res));

// GET /api/goals/user/:userId - Get all goals for a specific user
router.get('/user/:userId', (req, res) => goalController.getGoalsByUserId(req, res));

// GET /api/goals/user/:userId/active - Get active goal for a specific user
router.get('/user/:userId/active', (req, res) => goalController.getActiveGoalByUserId(req, res));

// GET /api/goals/:id - Get goal by ID
router.get('/:id', (req, res) => goalController.getGoalById(req, res));

// PUT /api/goals/:id - Update goal by ID (generic update)
router.put('/:id', (req, res) => goalController.updateGoal(req, res));

// PUT /api/goals/:id/activate - Set a specific goal as active for the user (expects userId in body)
router.put('/:id/activate', (req, res) => goalController.setActiveGoal(req, res));

// DELETE /api/goals/:id - Delete goal by ID
router.delete('/:id', (req, res) => goalController.deleteGoal(req, res));

export default router; 