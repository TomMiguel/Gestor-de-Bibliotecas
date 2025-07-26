"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Importa los módulos de rutas que acabas de crear
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const loan_routes_1 = __importDefault(require("./routes/loan.routes"));
dotenv_1.default.config();
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('API de Gestión de Préstamos de Libros funcionando!');
});
// Monta las rutas de la API bajo el prefijo /api
app.use('/api/users', user_routes_1.default);
app.use('/api/books', book_routes_1.default);
app.use('/api/loans', loan_routes_1.default);
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
