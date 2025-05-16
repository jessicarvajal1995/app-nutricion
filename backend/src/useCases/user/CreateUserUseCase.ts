import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';


interface CreateUserDTO {
 name: string;
 age: number;
 height: number;
 currentWeight: number;
}


export class CreateUserUseCase {
 constructor(private userRepository: IUserRepository) {}


 async execute(data: CreateUserDTO): Promise<User> {
   // Aquí podrías agregar validaciones de negocio
   if (data.age <= 0) {
     throw new Error('La edad debe ser mayor que cero');
   }
  
   if (data.height <= 0) {
     throw new Error('La altura debe ser mayor que cero');
   }
  
   if (data.currentWeight <= 0) {
     throw new Error('El peso debe ser mayor que cero');
   }


   return this.userRepository.create(data);
 }
}
