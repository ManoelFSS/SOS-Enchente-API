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
});

// Exporta o pool para ser usado em outros módulos (models, controllers)
export default pool;
