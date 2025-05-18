import { Router } from 'express';
import { DishController } from '../controllers/DishController.js';
import { PrismaClient } from '@prisma/client';
import { PrismaDishRepository } from '../infrastructure/repositories/PrismaDishRepository.js';

const router = Router();

// Initialize dependencies
const prisma = new PrismaClient();
const dishRepository = new PrismaDishRepository(prisma);
const dishController = new DishController(dishRepository);

// Define Dish routes
// POST /api/dishes - Create a new dish
router.post('/', (req, res) => dishController.createDish(req, res));

// GET /api/dishes - Get all dishes
router.get('/', (req, res) => dishController.getAllDishes(req, res));

// GET /api/dishes/:id - Get dish by ID
router.get('/:id', (req, res) => dishController.getDishById(req, res));

// PUT /api/dishes/:id - Update dish by ID
router.put('/:id', (req, res) => dishController.updateDish(req, res));

// DELETE /api/dishes/:id - Delete dish by ID
router.delete('/:id', (req, res) => dishController.deleteDish(req, res));

export default router; 