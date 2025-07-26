// backend/src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller'; 

const router = Router();

// Rutas RESTful para la gestión de usuarios
router.get('/', UserController.getAllUsers);           
router.get('/:id', UserController.getUserById);       
router.post('/', UserController.createUser);          
router.put('/:id', UserController.updateUser);        
router.delete('/:id', UserController.deleteUser);     

export default router;