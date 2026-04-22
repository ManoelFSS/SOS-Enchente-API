/**
 * Controllers para gerenciamento de Doações.
 * Contém funções para criar, listar, atualizar e deletar doações.
 * Cada função interagi com o modelo Donation e retorna respostas HTTP.
 */

import Donation from "../models/Donation.js";

/**
 * Cria uma nova doação.
 * Usado na rota POST /api/donations.
 * O usuário autenticado é o doador da doação.
 * @param {Object} req - Requisição com dados da doação no body
 * @param {Object} res - Resposta Express
 */
export const createDonation = async (req, res) => {
  try {
    const { category, description, quantity, photo_url, city } = req.body;
    const user_id = req.user.id; // ID do usuário autenticado

    const donation = await Donation.create({
      user_id,
      category,
      description,
      quantity,
      photo_url,
      city,
      status: "available", // Status inicial da doação
    });

    res
      .status(201)
      .json({ message: "Donation created successfully", donation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Lista todas as doações com filtros opcionais.
 * Usado na rota GET /api/donations.
 * Pode filtrar por categoria, cidade ou status.
 * @param {Object} req - Requisição com query parameters (category, city, status)
 * @param {Object} res - Resposta Express
 */
export const listDonations = async (req, res) => {
  try {
    const { category, city, status } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (city) filters.city = city;
    if (status) filters.status = status;

    const donations = await Donation.findAll(filters);

    res.json({
      count: donations.length,
      donations,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Obtém uma doação específica por ID.
 * Usado na rota GET /api/donations/:id.
 * @param {Object} req - Requisição com ID na URL
 * @param {Object} res - Resposta Express
 */
export const getDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json({ donation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Atualiza uma doação existente.
 * Usado na rota PUT /api/donations/:id.
 * Apenas o doador pode atualizar sua doação.
 * @param {Object} req - Requisição com dados a atualizar no body
 * @param {Object} res - Resposta Express
 */
export const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { category, description, quantity, photo_url, status } = req.body;

    const updatedDonation = await Donation.update(id, user_id, {
      category,
      description,
      quantity,
      photo_url,
      status,
    });

    if (!updatedDonation) {
      return res.status(403).json({
        message: "Unauthorized: You can only update your own donations",
      });
    }

    res.json({
      message: "Donation updated successfully",
      donation: updatedDonation,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Deleta uma doação.
 * Usado na rota DELETE /api/donations/:id.
 * Apenas o doador pode deletar sua doação.
 * @param {Object} req - Requisição com ID na URL
 * @param {Object} res - Resposta Express
 */
export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const success = await Donation.delete(id, user_id);

    if (!success) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete your own donations",
      });
    }

    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Lista doações do usuário autenticado.
 * Usado na rota GET /api/donations/my-donations.
 * @param {Object} req - Requisição com usuário autenticado
 * @param {Object} res - Resposta Express
 */
export const getMyDonations = async (req, res) => {
  try {
    const user_id = req.user.id;
    const donations = await Donation.findByUserId(user_id);

    res.json({
      count: donations.length,
      donations,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
