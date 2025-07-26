"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/user.routes.ts
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Rutas RESTful para la gestión de usuarios
router.get('/', user_controller_1.UserController.getAllUsers);
router.get('/:id', user_controller_1.UserController.getUserById);
router.post('/', user_controller_1.UserController.createUser);
router.put('/:id', user_controller_1.UserController.updateUser);
router.delete('/:id', user_controller_1.UserController.deleteUser);
exports.default = router;
