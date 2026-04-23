/**
 * Configuração da conexão com o banco de dados PostgreSQL.
 * Utiliza o módulo 'pg' para criar um pool de conexões, permitindo reutilização e eficiência.
 * O pool gerencia múltiplas conexões simultâneas, evitando sobrecarga no banco.
 */

import pkg from "pg"; // Biblioteca PostgreSQL para Node.js
import dotenv from "dotenv"; // Carrega variáveis de ambiente

dotenv.config(); // Inicializa as variáveis de ambiente

const { Pool } = pkg; // Extrai a classe Pool do módulo pg

// Cria um pool de conexões usando a string de conexão do ambiente
// A string DATABASE_URL deve estar no formato: postgresql://user:password@host:port/database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // Configurações para lidar com conexões instáveis
  connectionTimeoutMillis: 10000, // 10 segundos
  idleTimeoutMillis: 30000, // 30 segundos
  max: 10, // Máximo 10 conexões
  allowExitOnIdle: false,
});

// Testa a conexão na inicialização (opcional, apenas para logging)
pool.on("connect", (client) => {
  console.log("✅ Nova conexão estabelecida com o banco de dados");
});

pool.on("error", (err, client) => {
  console.error("❌ Erro na conexão do pool:", err.message);
});

// Função para testar conexão (útil para health checks)
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Falha na conexão com banco:", error.message);
    return false;
  }
};

// Exporta o pool para ser usado em outros módulos (models, controllers)
export default pool;
