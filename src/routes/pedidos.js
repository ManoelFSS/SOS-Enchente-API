/**
 * Rotas para gerenciamento de Pedidos de Doação.
 * Define endpoints para CRUD de pedidos.
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

// Rota para criar pedido (protegida - requer autenticação e validação)
router.post("/", authenticateToken, validateRequest, createRequest);

// Rota para listar pedidos do usuário autenticado (protegida - deve vir ANTES de /:id)
router.get("/my-pedidos", authenticateToken, getMyRequests);

// Rota para listar pedidos críticos de uma cidade (pública - deve vir ANTES de /:id)
router.get("/critical/:city", getCriticalRequests);

// Rota para listar todos os pedidos (pública)
router.get("/", listRequests);

// Rota para obter um pedido específico (pública)
router.get("/:id", getRequest);

// Rota para atualizar pedido (protegida - apenas solicitante pode atualizar)
router.put("/:id", authenticateToken, validateRequestUpdate, updateRequest);

// Rota para deletar pedido (protegida - apenas solicitante pode deletar)
router.delete("/:id", authenticateToken, deleteRequest);

export default router;
