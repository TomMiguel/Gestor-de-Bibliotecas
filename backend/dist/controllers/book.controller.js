"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const book_service_1 = require("../services/book.service");
const error_handler_1 = require("../utils/error.handler");
class BookController {
    static async getBooks(req, res) {
        const { disponible } = req.query;
        try {
            let books;
            if (disponible === 'true') {
                books = await book_service_1.BookService.getAvailableBooks();
            }
            else {
                books = await book_service_1.BookService.getAllBooks();
            }
            res.status(200).json(books);
        }
        catch (error) {
            (0, error_handler_1.handleError)(res, error, 'Error al obtener los libros.');
        }
    }
    static async getBookById(req, res) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de libro inválido.' });
            return;
        }
        try {
            const book = await book_service_1.BookService.getBookById(id);
            if (book) {
                res.status(200).json(book);
            }
            else {
                res.status(404).json({ message: 'Libro no encontrado.' });
            }
        }
        catch (error) {
            (0, error_handler_1.handleError)(res, error, `Error al obtener el libro con ID ${id}.`);
        }
    }
    static async createBook(req, res) {
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
        }
        else if (typeof disponible === 'string') {
            isAvailable = (disponible === 'true');
        }
        try {
            const bookToCreate = {
                titulo,
                autor,
                isbn,
                disponible: isAvailable
            };
            const newBook = await book_service_1.BookService.createBook(bookToCreate);
            res.status(201).json(newBook);
        }
        catch (error) {
            (0, error_handler_1.handleError)(res, error, 'Error al crear el libro.');
        }
    }
    static async updateBook(req, res) {
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
        let isAvailable = undefined;
        if (typeof disponible === 'boolean') {
            isAvailable = disponible;
        }
        else if (typeof disponible === 'string') {
            isAvailable = (disponible === 'true');
        }
        try {
            const bookToUpdate = { titulo, autor, isbn };
            if (isAvailable !== undefined) {
                bookToUpdate.disponible = isAvailable;
            }
            const updated = await book_service_1.BookService.updateBook(id, bookToUpdate);
            if (updated) {
                res.status(200).json({ message: 'Libro actualizado exitosamente.' });
            }
            else {
                res.status(404).json({ message: 'Libro no encontrado para actualizar.' });
            }
        }
        catch (error) {
            (0, error_handler_1.handleError)(res, error, `Error al actualizar el libro con ID ${id}.`);
        }
    }
    static async deleteBook(req, res) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de libro inválido.' });
            return;
        }
        try {
            const deleted = await book_service_1.BookService.deleteBook(id);
            if (deleted) {
                res.status(204).send();
            }
            else {
                res.status(404).json({ message: 'Libro no encontrado para eliminar.' });
            }
        }
        catch (error) {
            (0, error_handler_1.handleError)(res, error, `Error al eliminar el libro con ID ${id}.`);
        }
    }
}
exports.BookController = BookController;
