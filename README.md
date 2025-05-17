# app-nutricion

cd backend
npm install
npx nodemon src/index.ts


cd frontend
npm install
npm run dev


cd backend && npm install


Cada vez que modifiques schema.prisma, 
recuerda ejecutar npx prisma generate en la carpeta backend para actualizar tu cliente Prisma y los tipos de TypeScript.

Definir tus Modelos de Datos (Prisma Schema):
Ya tienes un schema.prisma (en backend/prisma/schema.prisma) con un modelo User y otros. Asegúrate de que estos modelos representen la información que quieres almacenar (ej., usuarios, posteos, productos, etc.).
Cada vez que modifiques schema.prisma, recuerda ejecutar npx prisma generate en la carpeta backend para actualizar tu cliente Prisma y los tipos de TypeScript.


Crear Endpoints en tu API (Rutas de Express):
En backend/src/index.ts (o mejor, en archivos de rutas separados que importes en index.ts), necesitas definir rutas que tu frontend pueda llamar. Por ejemplo, para crear un usuario:
POST /users
GET /users/:id
GET /users
PUT /users/:id
DELETE /users/:id
Estas rutas usarán tu cliente Prisma para interactuar con la base de datos.

Implementar la Lógica de los Endpoints (Controladores/Servicios/Casos de Uso):
Controladores: Reciben la petición HTTP, validan la entrada básica, y llaman a los servicios o casos de uso.
Servicios/Casos de Uso: Contienen la lógica de negocio. Por ejemplo, tu CreateGoalUseCase es un buen ejemplo. Estos interactuarán con los repositorios.
Repositorios: Abstraen el acceso a datos. Ya tienes PrismaUserRepository que usa Prisma para hablar con la base de datos. Necesitarás más repositorios para tus otros modelos (Dish, NutritionalGoal, etc.).



¿Dónde ver la data?
Tienes varias formas de ver los datos que almacenas:
Prisma Studio: Es una herramienta visual que viene con Prisma. Te permite ver y editar los datos en tu base de datos directamente.
Para iniciarlo, en una nueva terminal (en la carpeta backend), ejecuta:
Apply to README.md
Run
Esto abrirá una interfaz web en tu navegador (usualmente en http://localhost:5555).

Pasos para crear la BDD:

1. Configurar un usuario y base de datos en PostgreSQL (si no lo has hecho): 
    sudo -u postgres psql

2. Dentro de la consola psql, crea un rol (usuario) para tu aplicación. Usa una contraseña segura.:
    CREATE ROLE myappuser WITH LOGIN PASSWORD 'mysecurepassword';

3. (Reemplaza myappuser y mysecurepassword con lo que prefieras). Crea la base de datos para tu aplicación:
    CREATE DATABASE myappdb OWNER myappuser;
4. Salir:
    \q

5. Actualizar tu archivo .env:
    DATABASE_URL="postgresql://myappuser:mysecurepassword@localhost:5432/myappdb?schema=public"

6. Ejecutar las migraciones de Prisma:
    npx prisma migrate dev --name initial_setup 

7. Reiniciar tu servidor backend:
    npm run dev

8. Ver mi BDD:
        cd backend
        npx prisma studio
9. Prisma Studio se iniciará y te dará una URL, usualmente http://localhost:5555. Abre esta URL en tu navegador web.

10. POST http://localhost:3000/api/users 
    JSON:
         {
          "name": "Jessika Carvajal",
          "age": 29,
          "height": 153,
          "currentWeight": 60
        }
