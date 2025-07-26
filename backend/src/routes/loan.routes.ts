// backend/src/routes/loan.routes.ts
import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';

const router = Router();

// Rutas RESTful para la gestión de préstamos
router.put('/:id/return', LoanController.returnBook);    
router.get('/active', LoanController.getActiveLoans);    
router.get('/:id', LoanController.getLoanById);          
router.post('/', LoanController.createLoan);
router.put('/:id', LoanController.updateLoan);
router.delete('/:id', LoanController.deleteLoan);
router.get('/', LoanController.getLoans);      

export default router;