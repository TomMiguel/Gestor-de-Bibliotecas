"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = void 0;
// backend/src/config/db.ts
const promise_1 = __importDefault(require("mysql2/promise")); // Importa la librería mysql2 con soporte de promesas
const dotenv_1 = __importDefault(require("dotenv")); // Importa dotenv para cargar variables de entorno
dotenv_1.default.config(); // Carga las variables de entorno desde el archivo .env
// Configuración del pool de conexiones a la base de datos
// Un pool de conexiones es más eficiente para manejar múltiples solicitudes
// ya que reutiliza las conexiones existentes en lugar de abrir una nueva cada vez.
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Función asíncrona para obtener una conexión del pool.
// Esta función será utilizada por los servicios para ejecutar consultas SQL.
const getConnection = async () => {
    try {
        const connection = await pool.getConnection(); // Intenta obtener una conexión del pool
        return connection;
    }
    catch (error) {
        console.error('Error al intentar obtener una conexión de la base de datos:', error);
        throw error;
    }
};
exports.getConnection = getConnection;
exports.default = pool;
