import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository.js';

const router = Router();

// Initialize dependencies
const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);
const userController = new UserController(userRepository);

// Define routes
// POST /api/users - Create a new user
router.post('/', (req, res) => userController.createUser(req, res));

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => userController.getUserById(req, res));

// GET /api/users - Get all users
router.get('/', (req, res) => userController.getAllUsers(req, res));

// PUT /api/users/:id - Update user by ID
router.put('/:id', (req, res) => userController.updateUser(req, res));

// DELETE /api/users/:id - Delete user by ID
router.delete('/:id', (req, res) => userController.deleteUserById(req, res));


export default router; 