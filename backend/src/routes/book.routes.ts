// backend/src/routes/book.routes.ts
import { Router } from 'express';
import { BookController } from '../controllers/book.controller';

const router = Router();

// Rutas RESTful para la gestión de libros

router.get('/', BookController.getBooks);           
router.get('/:id', BookController.getBookById);     
router.post('/', BookController.createBook);        
router.put('/:id', BookController.updateBook);      
router.delete('/:id', BookController.deleteBook);   

export default router;