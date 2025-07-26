// backend/src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from '../services/user.service'; // Importa el servicio de usuarios
import { handleError } from '../utils/error.handler'; // Importa el manejador de errores

export class UserController {
    // GET /api/users - Obtener todos los usuarios (con info de préstamo)
    static async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users); // 200 OK
        } catch (error) {
            handleError(res, error, 'Error al obtener los usuarios.');
        }
    }

    // GET /api/users/:id - Obtener un usuario por ID
    static async getUserById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de usuario inválido.' }); // 400 Bad Request
            return;
        }
        try {
            const user = await UserService.getUserById(id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'Usuario no encontrado.' }); // 404 Not Found
            }
        } catch (error) {
            handleError(res, error, `Error al obtener el usuario con ID ${id}.`);
        }
    }

    // POST /api/users - Crear un nuevo usuario
    static async createUser(req: Request, res: Response): Promise<void> {
        const { nombre, email } = req.body;

        // Validaciones básicas de entrada
        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            res.status(400).json({ message: 'El nombre es obligatorio y debe ser una cadena de texto.' });
            return;
        }
        if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({ message: 'El email es obligatorio y debe tener un formato válido.' });
            return;
        }

        try {
            const newUser = await UserService.createUser({ nombre, email });
            res.status(201).json(newUser); // 201 Created
        } catch (error) {
            handleError(res, error, 'Error al crear el usuario.');
        }
    }

    // PUT /api/users/:id - Actualizar un usuario existente
    static async updateUser(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de usuario inválido.' });
            return;
        }

        const { nombre, email } = req.body;
        
        if (!nombre && !email) {
            res.status(400).json({ message: 'Se requiere al menos un campo (nombre o email) para actualizar.' });
            return;
        }
        if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
            res.status(400).json({ message: 'El nombre debe ser una cadena de texto no vacía.' });
            return;
        }
        if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            res.status(400).json({ message: 'El email debe tener un formato válido.' });
            return;
        }

        try {
            const updated = await UserService.updateUser(id, { nombre, email });
            if (updated) {
                res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
            } else {
                res.status(404).json({ message: 'Usuario no encontrado para actualizar.' });
            }
        } catch (error) {
            handleError(res, error, `Error al actualizar el usuario con ID ${id}.`);
        }
    }

    // DELETE /api/users/:id - Eliminar un usuario
    static async deleteUser(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de usuario inválido.' });
            return;
        }
        try {
            const deleted = await UserService.deleteUser(id);
            if (deleted) {
                res.status(204).send(); // 204 No Content (Éxito sin contenido)
            } else {
                res.status(404).json({ message: 'Usuario no encontrado para eliminar.' });
            }
        } catch (error) {
            handleError(res, error, `Error al eliminar el usuario con ID ${id}.`);
        }
    }
}