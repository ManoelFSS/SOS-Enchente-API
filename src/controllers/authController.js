/**
 * Controllers para autenticação.
 * Contém as funções que lidam com as requisições de registro, login e perfil.
 * Interagem com os models para acessar o banco e retornam respostas HTTP.
 */

import User from "../models/User.js"; // Modelo de usuário para operações no banco
import { hashPassword, verifyPassword, generateToken } from "../utils/auth.js"; // Utilitários de auth

/**
 * Controller para registro de novos usuários.
 * Valida se o email já existe, hashea a senha e cria o usuário.
 * Retorna os dados do usuário criado ou erro se já existir.
 * Usado pela rota POST /auth/register.
 * @param {Object} req - Requisição com dados do usuário no body
 * @param {Object} res - Resposta Express
 */





export const register = async (req, res) => {
  const client = await pool.connect(); // importante para transação

  try {
    const { name, email, password } = req.body;

    // 🔹 Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // 🔹 Verifica se já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    // 🔥 TRANSAÇÃO (garante consistência)
    await client.query("BEGIN");

    const user = await User.create(
      {
        name,
        email,
        password: hashedPassword,
      },
      client,
    );

    // 🔥 cria profile automaticamente
    await client.query(`INSERT INTO profiles (user_id) VALUES ($1)`, [user.id]);

    await client.query("COMMIT");

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Register error:", error);

    // 🔥 Tratamento completo de conexão
    if (
      error.code === "ENOTFOUND" ||
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.message.includes("timeout")
    ) {
      return res.status(503).json({
        message: "Database temporarily unavailable. Please try again later.",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  } finally {
    client.release(); // MUITO IMPORTANTE
  }
};

// export const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = await User.findByEmail(email); // Verifica se email já existe
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" }); // Erro se já cadastrado
//     }

//     const hashedPassword = await hashPassword(password); // Hashea a senha para segurança
//     const user = await User.create({ name, email, password: hashedPassword }); // Cria usuário no banco

//     res.status(201).json({ message: "User registered successfully", user }); // Sucesso
//   } catch (error) {
//     console.error("Register error:", error.message);
//     // Verifica se é erro de conexão com banco
//     if (
//       error.message.includes("ENOTFOUND") ||
//       error.message.includes("ECONNREFUSED")
//     ) {
//       return res.status(503).json({
//         message: "Database temporarily unavailable. Please try again later.",
//       });
//     }
//     res.status(500).json({ message: "Server error", error: error.message }); // Erro interno
//   }
// };

/**
 * Controller para login de usuários.
 * Verifica credenciais, gera token JWT se válidas.
 * Retorna token para autenticação futura ou erro se inválidas.
 * Usado pela rota POST /auth/login.
 * @param {Object} req - Requisição com email e password no body
 * @param {Object} res - Resposta Express
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email); // Busca usuário por email
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" }); // Erro se não encontrado
    }

    const isPasswordValid = await verifyPassword(password, user.password); // Verifica senha
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" }); // Erro se senha incorreta
    }

    const token = generateToken({ id: user.id, email: user.email }); // Gera token JWT

    res.json({ message: "Login successful", token }); // Retorna token
  } catch (error) {
    console.error("Login error:", error.message);
    // Verifica se é erro de conexão com banco
    if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return res.status(503).json({
        message: "Database temporarily unavailable. Please try again later.",
      });
    }
    res.status(500).json({ message: "Server error", error: error.message }); // Erro interno
  }
};

/**
 * Controller para obter perfil do usuário autenticado.
 * Usa o ID do usuário do token JWT para buscar dados seguros.
 * Retorna dados do usuário ou erro se não encontrado.
 * Usado pela rota GET /auth/profile (protegida).
 * @param {Object} req - Requisição com req.user definido pelo middleware
 * @param {Object} res - Resposta Express
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Busca usuário pelo ID do token
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Erro se não encontrado
    }
    res.json({ user }); // Retorna dados do usuário
  } catch (error) {
    console.error("Get profile error:", error.message);
    // Verifica se é erro de conexão com banco
    if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return res.status(503).json({
        message: "Database temporarily unavailable. Please try again later.",
      });
    }
    res.status(500).json({ message: "Server error", error: error.message }); // Erro interno
  }
};
