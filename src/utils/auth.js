/**
 * Utilitários de autenticação e segurança.
 * Contém funções para hash de senhas, verificação de senhas, geração e verificação de tokens JWT.
 * Usado pelos controllers e middlewares para gerenciar autenticação de forma segura.
 */

import bcrypt from "bcryptjs"; // Biblioteca para hash de senhas
import jwt from "jsonwebtoken"; // Biblioteca para geração e verificação de tokens JWT
import dotenv from "dotenv"; // Carrega variáveis de ambiente

dotenv.config(); // Inicializa variáveis de ambiente

/**
 * Gera um hash seguro para a senha.
 * Usado no registro de usuários para armazenar senhas de forma criptografada.
 * O saltRounds define a complexidade do hash (10 é um valor padrão seguro).
 * @param {string} password - Senha em texto plano
 * @returns {string} Senha hasheada
 */
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Verifica se uma senha em texto plano corresponde ao hash armazenado.
 * Usado no login para validar credenciais do usuário.
 * @param {string} password - Senha em texto plano
 * @param {string} hashedPassword - Senha hasheada do banco
 * @returns {boolean} True se a senha estiver correta
 */
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Gera um token JWT com os dados do usuário.
 * Usado após login bem-sucedido para criar um token de autenticação.
 * O token expira em 1 hora para segurança.
 * @param {Object} payload - Dados a serem incluídos no token (ex: {id, email})
 * @returns {string} Token JWT assinado
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

/**
 * Verifica e decodifica um token JWT.
 * Usado pelos middlewares de autenticação para validar tokens de requisições.
 * Lança erro se o token for inválido ou expirado.
 * @param {string} token - Token JWT a ser verificado
 * @returns {Object} Payload decodificado do token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
