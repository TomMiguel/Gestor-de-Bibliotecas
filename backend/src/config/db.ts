// backend/src/config/db.ts
import mysql from 'mysql2/promise'; // Importa la librería mysql2 con soporte de promesas
import dotenv from 'dotenv';       // Importa dotenv para cargar variables de entorno

dotenv.config(); // Carga las variables de entorno desde el archivo .env

// Configuración del pool de conexiones a la base de datos
// Un pool de conexiones es más eficiente para manejar múltiples solicitudes
// ya que reutiliza las conexiones existentes en lugar de abrir una nueva cada vez.
const pool = mysql.createPool({
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
export const getConnection = async () => {
    try {
        const connection = await pool.getConnection(); // Intenta obtener una conexión del pool
        return connection;
    } catch (error) {
        console.error('Error al intentar obtener una conexión de la base de datos:', error);
        throw error;
    }
};

export default pool;