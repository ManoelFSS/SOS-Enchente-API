/**
 * Middlewares de validação para Doações e Requisições.
 * Valida dados enviados antes de chegar aos controllers usando Joi.
 * Garante integridade e segurança dos dados.
 */

import Joi from "joi";

/**
 * Valida dados para criação de doação.
 * Aplica antes do controller createDonation.
 * Valida: category, description, quantity, photo_url, city.
 * @param {Object} req - Requisição com dados no body
 * @param {Object} res - Resposta Express
 * @param {Function} next - Próximo middleware
 */
export const validateDonation = (req, res, next) => {
  const schema = Joi.object({
    category: Joi.string()
      .valid("medicine", "clothes", "food", "water", "supplies", "other")
      .required(),
    description: Joi.string().min(5).max(500).required(),
    quantity: Joi.string().min(1).max(100).required(),
    photo_url: Joi.string().uri().required(),
    city: Joi.string().min(2).max(100).required(),
    cep: Joi.string().min(5).max(20).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

/**
 * Valida dados para atualização de doação.
 * Aplica antes do controller updateDonation.
 * Todos os campos são opcionais (PATCH-like).
 * @param {Object} req - Requisição com dados no body
 * @param {Object} res - Resposta Express
 * @param {Function} next - Próximo middleware
 */
export const validateDonationUpdate = (req, res, next) => {
  const schema = Joi.object({
    category: Joi.string().valid(
      "medicine",
      "clothes",
      "food",
      "water",
      "supplies",
      "other",
    ),
    description: Joi.string().min(5).max(500),
    quantity: Joi.string().min(1).max(100),
    photo_url: Joi.string().uri(),
    status: Joi.string().valid("available", "unavailable", "completed"),
    city: Joi.string().min(2).max(100),
    cep: Joi.string().min(5).max(20),
  }).min(1);

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

/**
 * Valida dados para criação de requisição de doação.
 * Aplica antes do controller createRequest.
 * Valida: category, description, quantity, urgency, city.
 * @param {Object} req - Requisição com dados no body
 * @param {Object} res - Resposta Express
 * @param {Function} next - Próximo middleware
 */
export const validateRequest = (req, res, next) => {
  const schema = Joi.object({
    category: Joi.string()
      .valid("medicine", "clothes", "food", "water", "supplies", "other")
      .required(),
    description: Joi.string().min(5).max(500).required(),
    quantity: Joi.string().min(1).max(100).required(),
    urgency: Joi.string().valid("low", "medium", "high", "critical").required(),
    city: Joi.string().min(2).max(100).required(),
    cep: Joi.string().min(5).max(20).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

/**
 * Valida dados para atualização de requisição.
 * Aplica antes do controller updateRequest.
 * Todos os campos são opcionais.
 * @param {Object} req - Requisição com dados no body
 * @param {Object} res - Resposta Express
 * @param {Function} next - Próximo middleware
 */
export const validateRequestUpdate = (req, res, next) => {
  const schema = Joi.object({
    category: Joi.string().valid(
      "medicine",
      "clothes",
      "food",
      "water",
      "supplies",
      "other",
    ),
    description: Joi.string().min(5).max(500),
    quantity: Joi.string().min(1).max(100),
    urgency: Joi.string().valid("low", "medium", "high", "critical"),
    status: Joi.string().valid("open", "matched", "completed", "cancelled"),
    city: Joi.string().min(2).max(100),
    cep: Joi.string().min(5).max(20),
  }).min(1);

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
