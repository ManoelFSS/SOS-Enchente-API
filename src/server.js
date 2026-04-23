/**
 * Arquivo principal do servidor Express.
 * Configura o servidor, middlewares, rotas e inicia a aplicação.
 * Responsável por inicializar a API e gerenciar requisições HTTP.
 */

import express from "express"; // Framework web para Node.js, usado para criar o servidor e gerenciar rotas
import cors from "cors"; // Middleware para permitir requisições de origens diferentes (Cross-Origin Resource Sharing)
import helmet from "helmet"; // Middleware de segurança que define headers HTTP seguros
import morgan from "morgan"; // Middleware de logging para registrar requisições HTTP
import rateLimit from "express-rate-limit"; // Middleware para limitar o número de requisições por IP, prevenindo abusos
import dotenv from "dotenv"; // Carrega variáveis de ambiente do arquivo .env
import authRoutes from "./routes/auth.js"; // Rotas de autenticação importadas do módulo auth
import donationRoutes from "./routes/donations.js"; // Rotas de doações
import pedidoRoutes from "./routes/pedidos.js"; // Rotas de pedidos de doações

dotenv.config(); // Carrega as variáveis de ambiente

const app = express(); // Cria uma instância do aplicativo Express
const PORT = process.env.PORT || 3000; // Porta do servidor, definida pela variável de ambiente ou padrão 3000

// Middlewares aplicados a todas as rotas
app.use(helmet()); // Aplica headers de segurança para proteger contra vulnerabilidades comuns
app.use(cors()); // Permite requisições de diferentes origens, essencial para APIs públicas
app.use(morgan("combined")); // Registra logs detalhados das requisições no console
app.use(express.json()); // Parseia corpos de requisição JSON
app.use(express.urlencoded({ extended: true })); // Parseia corpos de requisição URL-encoded

// Rate limiting - Limita requisições para prevenir ataques DDoS ou abuso
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 100, // Máximo 100 requisições por IP nessa janela
});
app.use(limiter); // Aplica o rate limiting globalmente

// Rotas - Define prefixos para grupos de rotas (simplificados)
app.use("/auth", authRoutes); // Rotas de autenticação
app.use("/donations", donationRoutes); // Rotas de doações
app.use("/pedidos", pedidoRoutes); // Rotas de pedidos de doações

// Rota raiz para confirmar que o serviço está ativo
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "SOS Enchente API is running" });
});

// Rota de health check - Verifica se a API está funcionando
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

// Rota de health check detalhado - Verifica banco de dados
app.get("/health/db", async (req, res) => {
  try {
    // Importa dinamicamente para evitar problemas de inicialização
    const { testConnection } = await import("./config/database.js");
    const dbConnected = await testConnection();

    if (dbConnected) {
      res.json({
        status: "OK",
        message: "API and database are running",
        database: "connected",
      });
    } else {
      res.status(503).json({
        status: "WARNING",
        message: "API is running but database is not accessible",
        database: "disconnected",
      });
    }
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      message: "Database connection failed",
      error: error.message,
      database: "error",
    });
  }
});

// Middleware de tratamento de erros - Captura erros não tratados e retorna resposta padronizada
// app.use((err, req, res, next) => {
//   console.error(err.stack); // Loga o erro no console para debugging
//   res.status(500).json({ message: "Something went wrong!" }); // Resposta genérica de erro
// });

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

// Middleware para rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" }); // Resposta para rotas inexistentes
});

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
