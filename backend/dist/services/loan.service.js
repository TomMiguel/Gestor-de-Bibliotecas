"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanService = void 0;
// backend/src/services/loan.service.ts
const db_1 = require("../config/db");
class LoanService {
    static async getAllLoans() {
        let connection;
        try {
            connection = await (0, db_1.getConnection)();
            const query = `
                SELECT
                    l.id, l.id_usuario, l.id_libro, l.fecha_prestamo, l.fecha_devolucion,
                    u.nombre AS user_nombre, u.email AS user_email,
                    b.titulo AS book_titulo, b.autor AS book_autor, b.disponible as book_disponible,
                    b.isbn AS book_isbn  -- <-- ¡Añade esta línea!
                FROM Prestamos l
                JOIN Usuarios u ON l.id_usuario = u.id
                JOIN Libros b ON l.id_libro = b.id
            `;
            const [rows] = await connection.execute(query);
            return rows.map((row) => ({
                id: row.id,
                id_usuario: row.id_usuario,
                id_libro: row.id_libro,
                fecha_prestamo: row.fecha_prestamo,
                fecha_devolucion: row.fecha_devolucion,
                user: { id: row.id_usuario, nombre: row.user_nombre, email: row.user_email },
                // <-- ¡Añade isbn aquí!
                book: { id: row.id_libro, titulo: row.book_titulo, autor: row.book_autor, isbn: row.book_isbn, disponible: row.book_disponible === 1 }
            }));
        }
        catch (error) {
            console.error("Error en LoanService.getAllLoans:", error);
            throw new Error(`Error al obtener todos los préstamos: ${error.message}`);
        }
        finally {
            if (connection)
                connection.release();
        }
    }
    // Obtener solo los préstamos activos (donde fecha_devolucion es NULL)
    static async getActiveLoans() {
        let connection;
        try {
            connection = await (0, db_1.getConnection)();
            const query = `
                SELECT
                    l.id, l.id_usuario, l.id_libro, l.fecha_prestamo, l.fecha_devolucion,
                    u.nombre AS user_nombre, u.email AS user_email,
                    b.titulo AS book_titulo, b.autor AS book_autor, b.disponible as book_disponible,
                    b.isbn AS book_isbn  -- <-- ¡Añade esta línea!
                FROM Prestamos l
                JOIN Usuarios u ON l.id_usuario = u.id
                JOIN Libros b ON l.id_libro = b.id
                WHERE l.fecha_devolucion IS NULL
            `;
            const [rows] = await connection.execute(query);
            return rows.map((row) => ({
                id: row.id,
                id_usuario: row.id_usuario,
                id_libro: row.id_libro,
                fecha_prestamo: row.fecha_prestamo,
                fecha_devolucion: row.fecha_devolucion,
                user: { id: row.id_usuario, nombre: row.user_nombre, email: row.user_email },
                // <-- ¡Añade isbn aquí!
                book: { id: row.id_libro, titulo: row.book_titulo, autor: row.book_autor, isbn: row.book_isbn, disponible: row.book_disponible === 1 }
            }));
        }
        catch (error) {
            console.error("Error en LoanService.getActiveLoans:", error);
            throw new Error(`Error al obtener los préstamos activos: ${error.message}`);
        }
        finally {
            if (connection)
                connection.release();
        }
    }
    // Obtener un préstamo por ID
    static async getLoanById(id) {
        let connection;
        try {
            connection = await (0, db_1.getConnection)();
            const query = `
                SELECT
                    l.id, l.id_usuario, l.id_libro, l.fecha_prestamo, l.fecha_devolucion,
                    u.nombre AS user_nombre, u.email AS user_email,
                    b.titulo AS book_titulo, b.autor AS book_autor, b.disponible as book_disponible,
                    b.isbn AS book_isbn
                FROM Prestamos l
                JOIN Usuarios u ON l.id_usuario = u.id
                JOIN Libros b ON l.id_libro = b.id
                WHERE l.id = ?
            `;
            const [rows] = await connection.execute(query, [id]);
            if (rows.length === 0) {
                return undefined;
            }
            const row = rows[0];
            return {
                id: row.id,
                id_usuario: row.id_usuario,
                id_libro: row.id_libro,
                fecha_prestamo: row.fecha_prestamo,
                fecha_devolucion: row.fecha_devolucion,
                user: { id: row.id_usuario, nombre: row.user_nombre, email: row.user_email },
                book: { id: row.id_libro, titulo: row.book_titulo, autor: row.book_autor, isbn: row.book_isbn, disponible: row.book_disponible === 1 }
            };
        }
        catch (error) {
            console.error("Error en LoanService.getLoanById:", error);
            throw new Error(`Error al obtener el préstamo por ID: ${error.message}`);
        }
        finally {
            if (connection)
                connection.release();
        }
    }
    // Crear un nuevo préstamo
    static async createLoan(loan) {
        let connection;
        try {
            connection = await (0, db_1.getConnection)();
            await connection.beginTransaction(); // Iniciar una transacción
            // 1. Verificar si el libro existe y está disponible
            const [bookRows] = await connection.execute('SELECT id, disponible FROM Libros WHERE id = ?', [loan.id_libro]);
            if (bookRows.length === 0) {
                throw new Error('El libro especificado no existe.');
            }
            if (!bookRows[0].disponible) {
                throw new Error('El libro no está disponible para préstamo.');
            }
            // 2. Insertar el préstamo
            const query = 'INSERT INTO Prestamos (id_usuario, id_libro, fecha_prestamo, fecha_devolucion) VALUES (?, ?, ?, ?)';
            const [result] = await connection.execute(query, [loan.id_usuario, loan.id_libro, loan.fecha_prestamo, loan.fecha_devolucion]);
            // 3. Actualizar la disponibilidad del libro a 0 (no disponible)
            await connection.execute('UPDATE Libros SET disponible = 0 WHERE id = ?', [loan.id_libro]);
            await connection.commit(); // Confirmar la transacción
            // 4. Obtener el préstamo completo con info de usuario y libro para devolver
            const newLoan = await this.getLoanById(result.insertId);
            if (!newLoan) {
                throw new Error('No se pudo recuperar el préstamo recién creado.');
            }
            return newLoan;
        }
        catch (error) {
            if (connection)
                await connection.rollback(); // Revertir la transacción en caso de error
            console.error("Error en LoanService.createLoan:", error);
            throw new Error(`Error al crear el préstamo en el servicio: ${error.message}`);
        }
        finally {
            if (connection)
                connection.release();
        }
    }
    // Actualizar un préstamo existente (actualización general, no solo devolución)
    static async updateLoan(id, loan) {
        let connection;
        try {
            connection = await (0, db_1.getConnection)();
            await connection.beginTransaction(); // Iniciar una transacción
            let fields = [];
            let values = [];
            let oldBookId;
            let currentLoanReturnDate;
            // Obtener el préstamo actual para verificar si el libro o la fecha de devolución cambian
            const [currentLoanRows] = await connection.execute('SELECT id_libro, fecha_devolucion FROM Prestamos WHERE id = ?', [id]);
            if (currentLoanRows.length === 0) {
                return false; // Préstamo no encontrado
            }
            oldBookId = currentLoanRows[0].id_libro;
            currentLoanReturnDate = currentLoanRows[0].fecha_devolucion;
            if (loan.id_usuario !== undefined) {
                fields.push('id_usuario = ?');
                values.push(loan.id_usuario);
            }
            if (loan.id_libro !== undefined) {
                fields.push('id_libro = ?');
                values.push(loan.id_libro);
                // Si el libro cambia, necesitamos manejar la disponibilidad del libro viejo y nuevo
                if (loan.id_libro !== oldBookId) {
                    // Si el préstamo no ha sido devuelto (fecha_devolucion IS NULL)
                    if (currentLoanReturnDate === null) {
                        // Marcar el libro antiguo como disponible
                        await connection.execute('UPDATE Libros SET disponible = 1 WHERE id = ?', [oldBookId]);
                        // Marcar el nuevo libro como no disponible
                        await connection.execute('UPDATE Libros SET disponible = 0 WHERE id = ?', [loan.id_libro]);
                    }
                }
            }
            if (loan.fecha_prestamo !== undefined) {
                fields.push('fecha_prestamo = ?');
                values.push(loan.fecha_prestamo);
            }
            if (loan.fecha_devolucion !== undefined) {
                fields.push('fecha_devolucion = ?');
                values.push(loan.fecha_devolucion);
                // Si la fecha de devolución cambia de NULL a una fecha, significa que el libro se devolvió
                if (currentLoanReturnDate === null && loan.fecha_devolucion !== null) {
                    await connection.execute('UPDATE Libros SET disponible = 1 WHERE id = ?', [oldBookId]);
                }
                // Si la fecha de devolución cambia de una fecha a NULL, significa que el libro se vuelve a prestar
                else if (currentLoanReturnDate !== null && loan.fecha_devolucion === null) {
                    await connection.execute('UPDATE Libros SET disponible = 0 WHERE id = ?', [oldBookId]);
                }
            }
            if (fields.length === 0) {
                return false;
            }
            const query = `UPDATE Prestamos SET ${fields.join(', ')} WHERE id = ?`;
            values.push(id);
            const [result] = await connection.execute(query, values);
            await connection.commit(); // Confirmar la transacción
            return result.affectedRows > 0;
        }
        catch (error) {
            if (connection)
                await connection.rollback(); // Revertir la transacción
            console.error("Error en LoanService.updateLoan:", error);
            throw new Error(`Error al actualizar el préstamo en el servicio: ${error.message}`);
        }
        finally {
            if (connection)
                connection.release();
        }
    }
    // Marcar un libro como devuelto (nueva lógica para la ruta /:id/return)
    static async returnBook(loanId) {
        let connection;
        try {
            connection = await (0, db_1.getConnection)();
            await connection.beginTransaction();
            const [loanRows] = await connection.execute('SELECT id_libro, fecha_devolucion FROM Prestamos WHERE id = ?', [loanId]);
            if (loanRows.length === 0) {
                throw new Error('Préstamo no encontrado.');
            }
            const loan = loanRows[0];
            if (loan.fecha_devolucion !== null) {
                // El libro ya está devuelto
                throw new Error('El libro de este préstamo ya ha sido devuelto.');
            }
            // Actualizar la fecha de devolución en el préstamo a la fecha actual
            const today = new Date().toISOString().substring(0, 10); // Formato 'YYYY-MM-DD'
            const [updateLoanResult] = await connection.execute('UPDATE Prestamos SET fecha_devolucion = ? WHERE id = ?', [today, loanId]);
            // Marcar el libro asociado como disponible
            await connection.execute('UPDATE Libros SET disponible = 1 WHERE id = ?', [loan.id_libro]);
            await connection.commit();
            return updateLoanResult.affectedRows > 0;
        }
        catch (error) {
            if (connection)
                await connection.rollback();
            console.error("Error en LoanService.returnBook:", error);
            throw new Error(`Error al marcar el libro como devuelto: ${error.message}`);
        }
        finally {
            if (connection)
                connection.release();
        }
    }
    // Eliminar un préstamo
    static async deleteLoan(id) {
        let connection;
        try {
            connection = await (0, db_1.getConnection)();
            await connection.beginTransaction(); // Iniciar una transacción
            // 1. Obtener el id_libro antes de eliminar el préstamo
            const [loanRows] = await connection.execute('SELECT id_libro, fecha_devolucion FROM Prestamos WHERE id = ?', [id]);
            if (loanRows.length === 0) {
                return false; // Préstamo no encontrado
            }
            const bookId = loanRows[0].id_libro;
            const fechaDevolucion = loanRows[0].fecha_devolucion;
            // 2. Eliminar el préstamo
            const [result] = await connection.execute('DELETE FROM Prestamos WHERE id = ?', [id]);
            // 3. Si se eliminó el préstamo Y el libro no había sido devuelto, marcar el libro como disponible
            if (result.affectedRows > 0 && fechaDevolucion === null) {
                await connection.execute('UPDATE Libros SET disponible = 1 WHERE id = ?', [bookId]);
            }
            await connection.commit(); // Confirmar la transacción
            return result.affectedRows > 0;
        }
        catch (error) {
            if (connection)
                await connection.rollback(); // Revertir la transacción
            console.error("Error en LoanService.deleteLoan:", error);
            throw new Error(`Error al eliminar el préstamo en el servicio: ${error.message}`);
        }
        finally {
            if (connection)
                connection.release();
        }
    }
}
exports.LoanService = LoanService;
