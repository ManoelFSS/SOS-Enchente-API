/**
 * Configuração SQLite para testes locais
 * Substitui temporariamente o PostgreSQL para desenvolvimento rápido
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o banco SQLite local
const dbPath = path.join(__dirname, "../../database/local.db");

// Cria conexão com SQLite
const db = new Database(dbPath);

// Habilita foreign keys
db.pragma("foreign_keys = ON");

// Cria tabelas se não existirem
const createTables = () => {
  // Tabela users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela donations
  db.exec(`
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity TEXT NOT NULL,
      photo_url TEXT,
      city TEXT NOT NULL,
      cep TEXT,
      status TEXT DEFAULT 'available',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Tabela donation_requests
  db.exec(`
    CREATE TABLE IF NOT EXISTS donation_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity TEXT NOT NULL,
      urgency TEXT DEFAULT 'medium',
      city TEXT NOT NULL,
      cep TEXT,
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  console.log("✅ Tabelas SQLite criadas/verficadas");
};

// Inicializa tabelas
createTables();

// Função para testar conexão
export const testConnection = async () => {
  try {
    const stmt = db.prepare("SELECT 1");
    stmt.get();
    return true;
  } catch (error) {
    console.error("❌ Falha na conexão SQLite:", error.message);
    return false;
  }
};

// Métodos helper para queries
export const prepare = (sql) => db.prepare(sql);
export const transaction = (fn) => db.transaction(fn);

// Exporta a instância do banco
export default db;
