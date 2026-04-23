/**
 * Controllers para gerenciamento de Requisições de Doação.
 * Contém funções para criar, listar, atualizar e deletar requisições.
 * Cada função interage com o modelo DonationRequest e retorna respostas HTTP.
 */

import DonationRequest from "../models/DonationRequest.js";

/**
 * Cria uma nova requisição de doação.
 * Usado na rota POST /api/requests.
 * O usuário autenticado é quem está fazendo a requisição.
 * @param {Object} req - Requisição com dados no body
 * @param {Object} res - Resposta Express
 */
export const createRequest = async (req, res) => {
  try {
    const { category, description, quantity, urgency, city, cep } = req.body;
    const user_id = req.user.id; // ID do usuário autenticado

    const donationRequest = await DonationRequest.create({
      user_id,
      category,
      description,
      quantity,
      urgency,
      city,
      cep,
      status: "open", // Status inicial da requisição
    });

    res.status(201).json({
      message: "Request created successfully",
      request: donationRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Lista todas as requisições com filtros opcionais.
 * Usado na rota GET /api/requests.
 * Pode filtrar por categoria, cidade, urgência ou status.
 * @param {Object} req - Requisição com query parameters
 * @param {Object} res - Resposta Express
 */
export const listRequests = async (req, res) => {
  try {
    const { category, city, urgency, status } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (city) filters.city = city;
    if (urgency) filters.urgency = urgency;
    if (status) filters.status = status;

    const requests = await DonationRequest.findAll(filters);

    res.json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Obtém uma requisição específica por ID.
 * Usado na rota GET /api/requests/:id.
 * @param {Object} req - Requisição com ID na URL
 * @param {Object} res - Resposta Express
 */
export const getRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await DonationRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Atualiza uma requisição existente.
 * Usado na rota PUT /api/requests/:id.
 * Apenas o solicitante pode atualizar sua requisição.
 * @param {Object} req - Requisição com dados a atualizar no body
 * @param {Object} res - Resposta Express
 */
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { category, description, quantity, urgency, status, city, cep } = req.body;

    const updatedRequest = await DonationRequest.update(id, user_id, {
      category,
      description,
      quantity,
      urgency,
      status,
      city,
      cep,
    });

    if (!updatedRequest) {
      return res.status(403).json({
        message: "Unauthorized: You can only update your own requests",
      });
    }

    res.json({
      message: "Request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Deleta uma requisição.
 * Usado na rota DELETE /api/requests/:id.
 * Apenas o solicitante pode deletar sua requisição.
 * @param {Object} req - Requisição com ID na URL
 * @param {Object} res - Resposta Express
 */
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const success = await DonationRequest.delete(id, user_id);

    if (!success) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete your own requests",
      });
    }

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Lista requisições do usuário autenticado.
 * Usado na rota GET /api/requests/my-requests.
 * @param {Object} req - Requisição com usuário autenticado
 * @param {Object} res - Resposta Express
 */
export const getMyRequests = async (req, res) => {
  try {
    const user_id = req.user.id;
    const requests = await DonationRequest.findByUserId(user_id);

    res.json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Lista requisições críticas em uma cidade específica.
 * Usado na rota GET /api/requests/critical/:city.
 * Retorna requisições prioritárias que precisam de atendimento urgente.
 * @param {Object} req - Requisição com city no parâmetro de rota
 * @param {Object} res - Resposta Express
 */
export const getCriticalRequests = async (req, res) => {
  try {
    const { city } = req.params;
    const requests = await DonationRequest.findByCritical("critical", city);

    res.json({
      count: requests.length,
      city,
      urgency: "critical",
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
