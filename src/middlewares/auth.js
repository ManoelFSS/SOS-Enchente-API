/**
 * Middleware de autenticação JWT.
 * Verifica se a requisição contém um token válido no header Authorization.
 * Usado para proteger rotas que requerem autenticação, como perfil do usuário.
 * Adiciona os dados do usuário decodificado ao objeto req para uso posterior.
 */

import { verifyToken } from "../utils/auth.js"; // Função para verificar tokens JWT

/**
 * Middleware que autentica requisições usando tokens JWT.
 * Deve ser aplicado a rotas protegidas antes dos controllers.
 * Extrai o token do header "Authorization: Bearer <token>".
 * Se válido, adiciona req.user com os dados do token e chama next().
 * Se inválido ou ausente, retorna erro 401 ou 403.
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função para passar para o próximo middleware
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Obtém o header Authorization
  const token = authHeader && authHeader.split(" ")[1]; // Extrai o token após "Bearer "

  if (!token) {
    return res.status(401).json({ message: "Access token required" }); // Erro se não há token
  }

  try {
    const decoded = verifyToken(token); // Verifica e decodifica o token
    req.user = decoded; // Adiciona dados do usuário à requisição
    next(); // Passa para o próximo middleware/controller
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" }); // Erro se token inválido
  }
};
