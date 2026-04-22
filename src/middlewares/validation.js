/**
 * Middlewares de validação de entrada usando Joi.
 * Valida os dados enviados nas requisições antes de chegarem aos controllers.
 * Previne dados inválidos ou maliciosos, melhorando segurança e robustez da API.
 */

import Joi from "joi"; // Biblioteca de validação de dados

/**
 * Middleware para validar dados de registro de usuário.
 * Aplica antes do controller de registro para garantir dados válidos.
 * Valida: name (2-50 chars), email (formato válido), password (mín 6 chars).
 * Retorna erro 400 se inválido, senão chama next().
 * @param {Object} req - Requisição com req.body contendo dados do usuário
 * @param {Object} res - Resposta Express
 * @param {Function} next - Próximo middleware
 */
export const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(), // Nome obrigatório, 2-50 caracteres
    email: Joi.string().email().required(), // Email obrigatório e válido
    password: Joi.string().min(6).required(), // Senha obrigatória, mín 6 caracteres
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message }); // Erro de validação
  }
  next(); // Dados válidos, prossegue
};

/**
 * Middleware para validar dados de login.
 * Aplica antes do controller de login para validar credenciais.
 * Valida: email (formato válido), password (obrigatório).
 * Retorna erro 400 se inválido, senão chama next().
 * @param {Object} req - Requisição com req.body contendo email e password
 * @param {Object} res - Resposta Express
 * @param {Function} next - Próximo middleware
 */
export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(), // Email obrigatório e válido
    password: Joi.string().required(), // Senha obrigatória
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message }); // Erro de validação
  }
  next(); // Dados válidos, prossegue
};
