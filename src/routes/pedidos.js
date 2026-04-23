/**
 * Rotas para gerenciamento de Requisições de Doação.
 * Define endpoints para CRUD de requisições.
 * Todas as rotas de modificação requerem autenticação.
 */

import express from "express";
import {
  createRequest,
  listRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  getMyRequests,
  getCriticalRequests,
} from "../controllers/requestController.js";
import { authenticateToken } from "../middlewares/auth.js";
import {
  validateRequest,
  validateRequestUpdate,
} from "../middlewares/donationValidation.js";

const router = express.Router();

// Rota para criar requisição (protegida - requer autenticação e validação)
router.post("/", authenticateToken, validateRequest, createRequest);

// Rota para listar requisições do usuário autenticado (protegida - deve vir ANTES de /:id)
router.get("/my-requests", authenticateToken, getMyRequests);

// Rota para listar requisições críticas de uma cidade (pública - deve vir ANTES de /:id)
router.get("/critical/:city", getCriticalRequests);

// Rota para listar todas as requisições (pública)
router.get("/", listRequests);

// Rota para obter uma requisição específica (pública)
router.get("/:id", getRequest);

// Rota para atualizar requisição (protegida - apenas solicitante pode atualizar)
router.put("/:id", authenticateToken, validateRequestUpdate, updateRequest);

// Rota para deletar requisição (protegida - apenas solicitante pode deletar)
router.delete("/:id", authenticateToken, deleteRequest);

export default router;
