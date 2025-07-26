// backend/src/services/user.service.ts
import { getConnection } from '../config/db'; 
import { User, UserWithLoanInfo } from '../models/user.model'; 
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2/promise'; 

// interfaz para el resultado de la consulta SQL que une usuarios con préstamos
interface UserLoanRow extends RowDataPacket {
    id: number;
    nombre: string;
    email: string;
    fecha_registro: string;
    libro_id: number | null;
    libro_titulo: string | null;
    libro_autor: string | null;
    libro_isbn: string | null;
}

export class UserService {

    // Método para obtener todos los usuarios, incluyendo información de su préstamo activo si lo tienen
    static async getAllUsers(): Promise<UserWithLoanInfo[]> {
        const connection = await getConnection(); // Obtiene una conexión del pool
        try {
            const [rows] = await connection.execute<UserLoanRow[]>(`
                SELECT
                    u.id, u.nombre, u.email, u.fecha_registro,
                    l.id AS libro_id, l.titulo AS libro_titulo, l.autor AS libro_autor, l.isbn AS libro_isbn
                FROM Usuarios u
                LEFT JOIN Prestamos p ON u.id = p.id_usuario AND p.fecha_devolucion IS NULL
                LEFT JOIN Libros l ON p.id_libro = l.id
                ORDER BY u.nombre ASC;
            `);

            // Mapea los resultados de la consulta a la estructura de UserWithLoanInfo
            return rows.map(row => ({
                id: row.id,
                nombre: row.nombre,
                email: row.email,
                fecha_registro: row.fecha_registro,
                libro_en_prestamo: row.libro_id ? { 
                    id: row.libro_id,
                    titulo: row.libro_titulo!, 
                    autor: row.libro_autor!,
                    isbn: row.libro_isbn!
                } : null // 
            }));
        } finally {
            connection.release(); // Libera la conexión de vuelta al pool
        }
    }

    // Método para crear un nuevo usuario
    static async createUser(user: User): Promise<User> {
        const connection = await getConnection();
        try {
            // Ejecuta la consulta de inserción con parámetros seguros (?)
            const [result] = await connection.execute<ResultSetHeader>(`
                INSERT INTO Usuarios (nombre, email) VALUES (?, ?)
            `, [user.nombre, user.email]);

            // Devuelve el usuario con el ID generado por la base de datos
            return { id: result.insertId, ...user };
        } finally {
            connection.release();
        }
    }

    // Método para obtener un usuario por su ID
    static async getUserById(id: number): Promise<User | null> {
        const connection = await getConnection();
        try {
            const [rows] = await connection.execute<User[] & RowDataPacket[]>(`
                SELECT id, nombre, email, fecha_registro FROM Usuarios WHERE id = ?
            `, [id]);
            return rows.length > 0 ? rows[0] : null; // Retorna el usuario o null si no se encontró
        } finally {
            connection.release();
        }
    }

    // Método para actualizar un usuario existente
    static async updateUser(id: number, user: Partial<User>): Promise<boolean> {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(`
                UPDATE Usuarios SET nombre = ?, email = ? WHERE id = ?
            `, [user.nombre, user.email, id]);
            return result.affectedRows > 0; // Retorna true si se actualizó al menos una fila
        } finally {
            connection.release();
        }
    }

    // Método para eliminar un usuario
    static async deleteUser(id: number): Promise<boolean> {
        const connection = await getConnection();
        try {
            // Antes de eliminar, verificar si hay préstamos activos para evitar errores de FK
            const [activeLoans] = await connection.execute<RowDataPacket[]>(`
                SELECT id FROM Prestamos WHERE id_usuario = ? AND fecha_devolucion IS NULL
            `, [id]);

            if (activeLoans.length > 0) {
                // Si tiene préstamos activos, no se puede eliminar
                throw new Error('No se puede eliminar el usuario porque tiene préstamos activos.');
            }

            const [result] = await connection.execute<ResultSetHeader>(`
                DELETE FROM Usuarios WHERE id = ?
            `, [id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }
}