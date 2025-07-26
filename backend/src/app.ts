// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importa los módulos de rutas que acabas de crear
import userRoutes from './routes/user.routes';
import bookRoutes from './routes/book.routes';
import loanRoutes from './routes/loan.routes';

dotenv.config();

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('API de Gestión de Préstamos de Libros funcionando!');
});

// Monta las rutas de la API bajo el prefijo /api
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de la API escuchando en el puerto ${PORT}`);
    console.log(`Accede a la API en: http://localhost:${PORT}`);
    // Puedes probar algunas rutas, por ejemplo:
    console.log(`Rutas disponibles:`);
    console.log(`  GET http://localhost:${PORT}/api/users`);
    console.log(`  POST http://localhost:${PORT}/api/users`);
    console.log(`  GET http://localhost:${PORT}/api/books`);
    console.log(`  POST http://localhost:${PORT}/api/loans`);
});