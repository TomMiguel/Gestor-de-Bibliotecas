// backend/src/services/book.service.ts
import { getConnection } from '../config/db'; 
import { Book } from '../models/book.model';

export class BookService {
    static async getAllBooks(): Promise<Book[]> {
        let connection; // Declara la conexión fuera del try para que sea accesible en finally
        try {
            connection = await getConnection(); // Obtiene una conexión del pool
            const [rows] = await connection.execute('SELECT * FROM Libros');
            return (rows as any[]).map(row => ({
                ...row,
                disponible: row.disponible === 1
            }));
        } catch (error: any) {
            console.error("Error en BookService.getAllBooks:", error);
            throw new Error(`Error al obtener todos los libros: ${error.message}`);
        } finally {
            if (connection) connection.release(); // ¡Libera la conexión al pool!
        }
    }

    static async getAvailableBooks(): Promise<Book[]> {
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM Libros WHERE disponible = 1');
            return (rows as any[]).map(row => ({
                ...row,
                disponible: row.disponible === 1
            }));
        } catch (error: any) {
            console.error("Error en BookService.getAvailableBooks:", error);
            throw new Error(`Error al obtener libros disponibles: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    static async getBookById(id: number): Promise<Book | undefined> {
        let connection;
        try {
            connection = await getConnection();
            const [rows]: any = await connection.execute('SELECT * FROM Libros WHERE id = ?', [id]);
            if (rows.length === 0) {
                return undefined;
            }
            return {
                ...rows[0],
                disponible: rows[0].disponible === 1
            };
        } catch (error: any) {
            console.error("Error en BookService.getBookById:", error);
            throw new Error(`Error al obtener el libro por ID: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    static async createBook(book: Book): Promise<Book> {
        let connection;
        try {
            connection = await getConnection();
            const disponibleValue = book.disponible ? 1 : 0;
            const query = 'INSERT INTO Libros (titulo, autor, isbn, disponible) VALUES (?, ?, ?, ?)';
            const [result]: any = await connection.execute(
                query,
                [book.titulo, book.autor, book.isbn, disponibleValue]
            );

            return { id: result.insertId, ...book, disponible: book.disponible };
        } catch (error: any) {
            console.error("Error en BookService.createBook:", error);
            throw new Error(`Error al crear el libro en el servicio: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    static async updateBook(id: number, book: Partial<Book>): Promise<boolean> {
        let connection;
        try {
            connection = await getConnection();
            let fields: string[] = [];
            let values: (string | number | boolean | null)[] = [];

            if (book.titulo !== undefined) { fields.push('titulo = ?'); values.push(book.titulo); }
            if (book.autor !== undefined) { fields.push('autor = ?'); values.push(book.autor); }
            if (book.isbn !== undefined) { fields.push('isbn = ?'); values.push(book.isbn); }
            if (book.disponible !== undefined) {
                fields.push('disponible = ?');
                values.push(book.disponible ? 1 : 0);
            }

            if (fields.length === 0) {
                return false;
            }

            const query = `UPDATE Libros SET ${fields.join(', ')} WHERE id = ?`;
            values.push(id);

            const [result]: any = await connection.execute(query, values);
            return result.affectedRows > 0;
        } catch (error: any) {
            console.error("Error en BookService.updateBook:", error);
            throw new Error(`Error al actualizar el libro en el servicio: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    static async deleteBook(id: number): Promise<boolean> {
        let connection;
        try {
            connection = await getConnection();
            const [result]: any = await connection.execute('DELETE FROM Libros WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error: any) {
            console.error("Error en BookService.deleteBook:", error);
            throw new Error(`Error al eliminar el libro en el servicio: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }
}