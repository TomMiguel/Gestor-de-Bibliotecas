// backend/src/controllers/loan.controller.ts
import { Request, Response } from 'express';
import { LoanService } from '../services/loan.service';
import { handleError } from '../utils/error.handler';

export class LoanController {
    // GET /api/loans - Obtener todos los préstamos
    // Coincide con router.get('/', LoanController.getLoans);
    static async getLoans(req: Request, res: Response): Promise<void> {
        try {
            const loans = await LoanService.getAllLoans(); // El servicio se llamará getAllLoans
            res.status(200).json(loans);
        } catch (error) {
            handleError(res, error, 'Error al obtener los préstamos.');
        }
    }

    // GET /api/loans/active - Obtener solo los préstamos activos (no devueltos)
    // Coincide con router.get('/active', LoanController.getActiveLoans);
    static async getActiveLoans(req: Request, res: Response): Promise<void> {
        try {
            const activeLoans = await LoanService.getActiveLoans();
            res.status(200).json(activeLoans);
        } catch (error) {
            handleError(res, error, 'Error al obtener los préstamos activos.');
        }
    }

    // GET /api/loans/:id - Obtener un préstamo por ID
    static async getLoanById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de préstamo inválido.' });
            return;
        }
        try {
            const loan = await LoanService.getLoanById(id);
            if (loan) {
                res.status(200).json(loan);
            } else {
                res.status(404).json({ message: 'Préstamo no encontrado.' });
            }
        } catch (error) {
            handleError(res, error, `Error al obtener el préstamo con ID ${id}.`);
        }
    }

    // POST /api/loans - Crear un nuevo préstamo
    static async createLoan(req: Request, res: Response): Promise<void> {
        const { id_usuario, id_libro, fecha_prestamo, fecha_devolucion } = req.body;

        if (!id_usuario || isNaN(parseInt(id_usuario))) {
            res.status(400).json({ message: 'El ID de usuario es obligatorio y debe ser un número.' });
            return;
        }
        if (!id_libro || isNaN(parseInt(id_libro))) {
            res.status(400).json({ message: 'El ID de libro es obligatorio y debe ser un número.' });
            return;
        }
        if (!fecha_prestamo || typeof fecha_prestamo !== 'string' || fecha_prestamo.trim() === '') {
            res.status(400).json({ message: 'La fecha de préstamo es obligatoria.' });
            return;
        }

        try {
            const newLoan = await LoanService.createLoan({
                id_usuario: parseInt(id_usuario),
                id_libro: parseInt(id_libro),
                fecha_prestamo,
                fecha_devolucion: fecha_devolucion || null
            });
            res.status(201).json(newLoan);
        } catch (error) {
            handleError(res, error, 'Error al crear el préstamo.');
        }
    }

    // PUT /api/loans/:id - Actualizar un préstamo existente (actualización general)
    static async updateLoan(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de préstamo inválido.' });
            return;
        }

        const { id_usuario, id_libro, fecha_prestamo, fecha_devolucion } = req.body;

        if (!id_usuario && !id_libro && !fecha_prestamo && !fecha_devolucion && fecha_devolucion !== null) {
            res.status(400).json({ message: 'Se requiere al menos un campo para actualizar.' });
            return;
        }

        try {
            const updated = await LoanService.updateLoan(id, {
                id_usuario: id_usuario ? parseInt(id_usuario) : undefined,
                id_libro: id_libro ? parseInt(id_libro) : undefined,
                fecha_prestamo,
                fecha_devolucion: fecha_devolucion === '' ? null : fecha_devolucion
            });
            if (updated) {
                res.status(200).json({ message: 'Préstamo actualizado exitosamente.' });
            } else {
                res.status(404).json({ message: 'Préstamo no encontrado para actualizar.' });
            }
        } catch (error) {
            handleError(res, error, `Error al actualizar el préstamo con ID ${id}.`);
        }
    }

    // PUT /api/loans/:id/return - Marcar un libro como devuelto
    // Coincide con router.put('/:id/return', LoanController.returnBook);
    static async returnBook(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de préstamo inválido.' });
            return;
        }
        try {
            const returned = await LoanService.returnBook(id);
            if (returned) {
                res.status(200).json({ message: 'Libro marcado como devuelto exitosamente.' });
            } else {
                res.status(404).json({ message: 'Préstamo no encontrado o ya devuelto.' });
            }
        } catch (error) {
            handleError(res, error, `Error al devolver el libro para el préstamo con ID ${id}.`);
        }
    }

    // DELETE /api/loans/:id - Eliminar un préstamo
    static async deleteLoan(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de préstamo inválido.' });
            return;
        }
        try {
            const deleted = await LoanService.deleteLoan(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Préstamo no encontrado para eliminar.' });
            }
        } catch (error) {
            handleError(res, error, `Error al eliminar el préstamo con ID ${id}.`);
        }
    }
}