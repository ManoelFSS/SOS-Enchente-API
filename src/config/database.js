/**
 * Configuração da conexão com o banco de dados PostgreSQL.
 * Utiliza o módulo 'pg' para criar um pool de conexões.
 * Funcionará tanto localmente quanto no Render (production).
 */

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Cria pool de conexões usando DATABASE_URL
// No Render, DATABASE_URL é fornecido automaticamente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Event listeners para monitorar a conexão
pool.on("connect", () => {
  console.log("✅ Conectado ao banco de dados PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Erro no pool de conexões:", err.message);
});

// Função para testar conexão
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("✅ Banco de dados está funcionando");
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error.message);
    return false;
  }
};

// Exporta o pool para ser usado em toda a aplicação
export default pool;
