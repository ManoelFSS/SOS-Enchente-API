/**
 * Definição das rotas de autenticação.
 * Organiza as rotas relacionadas a auth em um router separado.
 * Aplica middlewares de validação e autenticação conforme necessário.
 * Usado pelo servidor principal para prefixar com /api/auth.
 */

import express from "express"; // Framework Express para criar rotas
import { register, login, getProfile } from "../controllers/authController.js"; // Controllers de auth
import { authenticateToken } from "../middlewares/auth.js"; // Middleware de autenticação JWT
import { validateRegister, validateLogin } from "../middlewares/validation.js"; // Middlewares de validação

const router = express.Router(); // Cria um router Express para agrupar rotas

// Rota para registro: aplica validação primeiro, depois controller
router.post("/register", validateRegister, register);

// Rota para login: aplica validação primeiro, depois controller
router.post("/login", validateLogin, login);

// Rota para perfil: aplica autenticação JWT primeiro, depois controller (rota protegida)
router.get("/profile", authenticateToken, getProfile);

export default router; // Exporta o router para uso no servidor principal
