/**
 * Rotas para gerenciamento de Doações.
 * Define endpoints para CRUD de doações.
 * Todas as rotas de modificação requerem autenticação.
 */

import express from "express";
import {
  createDonation,
  listDonations,
  getDonation,
  updateDonation,
  deleteDonation,
  getMyDonations,
} from "../controllers/donationController.js";
import { authenticateToken } from "../middlewares/auth.js";
import {
  validateDonation,
  validateDonationUpdate,
} from "../middlewares/donationValidation.js";

const router = express.Router();

// Rota para criar doação (protegida - requer autenticação e validação)
router.post("/", authenticateToken, validateDonation, createDonation);

// Rota para listar doações do usuário autenticado (protegida - deve vir ANTES de /:id)
router.get("/my-donations", authenticateToken, getMyDonations);

// Rota para listar todas as doações (pública - sem autenticação)
router.get("/", listDonations);

// Rota para obter uma doação específica (pública)
router.get("/:id", getDonation);

// Rota para atualizar doação (protegida - apenas doador pode atualizar)
router.put("/:id", authenticateToken, validateDonationUpdate, updateDonation);

// Rota para deletar doação (protegida - apenas doador pode deletar)
router.delete("/:id", authenticateToken, deleteDonation);

export default router;
