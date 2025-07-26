"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/book.routes.ts
const express_1 = require("express");
const book_controller_1 = require("../controllers/book.controller");
const router = (0, express_1.Router)();
// Rutas RESTful para la gestión de libros
router.get('/', book_controller_1.BookController.getBooks);
router.get('/:id', book_controller_1.BookController.getBookById);
router.post('/', book_controller_1.BookController.createBook);
router.put('/:id', book_controller_1.BookController.updateBook);
router.delete('/:id', book_controller_1.BookController.deleteBook);
exports.default = router;
