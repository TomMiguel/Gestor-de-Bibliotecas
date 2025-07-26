// backend/src/controllers/book.controller.ts
import { Request, Response } from 'express';
import { BookService } from '../services/book.service';
import { handleError } from '../utils/error.handler';
import { Book } from '../models/book.model';

export class BookController {
    static async getBooks(req: Request, res: Response): Promise<void> {
        const { disponible } = req.query;
        try {
            let books;
            if (disponible === 'true') {
                books = await BookService.getAvailableBooks();
            } else {
                books = await BookService.getAllBooks();
            }
            res.status(200).json(books);
        } catch (error) {
            handleError(res, error, 'Error al obtener los libros.');
        }
    }

    static async getBookById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de libro inválido.' });
            return;
        }
        try {
            const book = await BookService.getBookById(id);
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: 'Libro no encontrado.' });
            }
        } catch (error) {
            handleError(res, error, `Error al obtener el libro con ID ${id}.`);
        }
    }

    static async createBook(req: Request, res: Response): Promise<void> {
        const { titulo, autor, isbn, disponible } = req.body;
        if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
            res.status(400).json({ message: 'El título es obligatorio.' });
            return;
        }
        if (!autor || typeof autor !== 'string' || autor.trim() === '') {
            res.status(400).json({ message: 'El autor es obligatorio.' });
            return;
        }
        if (!isbn || typeof isbn !== 'string' || isbn.trim() === '') {
            res.status(400).json({ message: 'El ISBN es obligatorio.' });
            return;
        }
        let isAvailable = true;
        if (typeof disponible === 'boolean') {
            isAvailable = disponible;
        } else if (typeof disponible === 'string') {
            isAvailable = (disponible === 'true');
        }
        try {
            const bookToCreate: Partial<Book> = {
                titulo,
                autor,
                isbn,
                disponible: isAvailable
            };
            const newBook = await BookService.createBook(bookToCreate as Book);
            res.status(201).json(newBook);
        } catch (error) {
            handleError(res, error, 'Error al crear el libro.');
        }
    }

    static async updateBook(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de libro inválido.' });
            return;
        }
        const { titulo, autor, isbn, disponible } = req.body;
        if (!titulo && !autor && !isbn && disponible === undefined) {
             res.status(400).json({ message: 'Se requiere al menos un campo para actualizar.' });
             return;
        }
        let isAvailable: boolean | undefined = undefined;
        if (typeof disponible === 'boolean') {
            isAvailable = disponible;
        } else if (typeof disponible === 'string') {
            isAvailable = (disponible === 'true');
        }
        try {
            const bookToUpdate: Partial<Book> = { titulo, autor, isbn };
            if (isAvailable !== undefined) {
                bookToUpdate.disponible = isAvailable;
            }
            const updated = await BookService.updateBook(id, bookToUpdate as Book);
            if (updated) {
                res.status(200).json({ message: 'Libro actualizado exitosamente.' });
            } else {
                res.status(404).json({ message: 'Libro no encontrado para actualizar.' });
            }
        } catch (error) {
            handleError(res, error, `Error al actualizar el libro con ID ${id}.`);
        }
    }

    static async deleteBook(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de libro inválido.' });
            return;
        }
        try {
            const deleted = await BookService.deleteBook(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Libro no encontrado para eliminar.' });
            }
        } catch (error) {
            handleError(res, error, `Error al eliminar el libro con ID ${id}.`);
        }
    }
}