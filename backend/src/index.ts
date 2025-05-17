import express, { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client'; // No longer needed here, managed in userRoutes
import userRoutes from './routes/userRoutes.js'; // Import user routes
import cors from 'cors'; // Import cors
// NutritionalGoal and IGoalRepository might be used for other routes later
// import { NutritionalGoal } from './entities/NutritionalGoal.js';
// import { IGoalRepository } from './repositories/IGoalRepository.js';

// CreateGoalUseCase and its DTO might be used for other routes later
// interface CreateGoalDTO { ... }
// export class CreateGoalUseCase { ... }

const app = express();
const PORT = process.env.PORT || 3000;
// const prisma = new PrismaClient(); // No longer needed here, managed in userRoutes

// Middleware CORS
// Esto permitirá todas las peticiones de cualquier origen. 
// Para producción, deberías configurarlo de forma más restrictiva.
app.use(cors()); 

app.use(express.json()); // Middleware to parse JSON bodies

// Base route
app.get('/', (req: Request, res: Response) => {
  res.send('¡Backend funcionando!');
});

// Use user routes, prefixing them with /api/users
app.use('/api/users', userRoutes);

// TODO: Add routes for Goals and other entities here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
