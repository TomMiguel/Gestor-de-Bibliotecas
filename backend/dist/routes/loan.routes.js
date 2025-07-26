"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/loan.routes.ts
const express_1 = require("express");
const loan_controller_1 = require("../controllers/loan.controller");
const router = (0, express_1.Router)();
// Rutas RESTful para la gestión de préstamos
router.put('/:id/return', loan_controller_1.LoanController.returnBook);
router.get('/active', loan_controller_1.LoanController.getActiveLoans);
router.get('/:id', loan_controller_1.LoanController.getLoanById);
router.post('/', loan_controller_1.LoanController.createLoan);
router.put('/:id', loan_controller_1.LoanController.updateLoan);
router.delete('/:id', loan_controller_1.LoanController.deleteLoan);
router.get('/', loan_controller_1.LoanController.getLoans);
exports.default = router;
