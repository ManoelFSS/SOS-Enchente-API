-- Script de inicialização do banco de dados PostgreSQL
-- Cria as tabelas necessárias para o sistema de autenticação e gerenciamento de doações

-- Cria a tabela users se não existir
-- id: Chave primária auto-incrementada
-- name: Nome do usuário (obrigatório, até 50 caracteres)
-- email: Email único do usuário (obrigatório, até 100 caracteres)
-- password: Senha hasheada (obrigatório, até 255 caracteres para suportar hashes longos)
-- created_at: Timestamp de criação automática
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cria índice na coluna email para acelerar buscas por email (usado no login e registro)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Tabela de Doações
-- Armazena itens que usuários desejam doar para ajudar pessoas em situação de risco
-- id: Chave primária
-- user_id: Referência ao usuário que está doando (chave estrangeira)
-- category: Categoria do item (medicine, clothes, food, water, supplies, other)
-- description: Descrição detalhada do item
-- quantity: Quantidade do item a ser doado
-- photo_url: URL da foto do item
-- city: Cidade onde a doação está disponível
-- status: Status da doação (available, unavailable, completed)
-- created_at: Timestamp de criação
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(500) NOT NULL,
  quantity VARCHAR(100) NOT NULL,
  photo_url VARCHAR(500),
  city VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance em filtros comuns
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_category ON donations(category);
CREATE INDEX IF NOT EXISTS idx_donations_city ON donations(city);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);

-- Tabela de Requisições de Doação
-- Armazena pedidos de ajuda feitos por usuários que precisam de suporte durante enchentes
-- id: Chave primária
-- user_id: Referência ao usuário que está pedindo ajuda (chave estrangeira)
-- category: Categoria do item necessário (medicine, clothes, food, water, supplies, other)
-- description: Descrição do que é necessário
-- quantity: Quantidade necessária
-- urgency: Nível de urgência (low, medium, high, critical)
-- city: Cidade onde a ajuda é necessária
-- status: Status da requisição (open, matched, completed, cancelled)
-- created_at: Timestamp de criação
CREATE TABLE IF NOT EXISTS donation_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(500) NOT NULL,
  quantity VARCHAR(100) NOT NULL,
  urgency VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance em filtros comuns
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON donation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_category ON donation_requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_city ON donation_requests(city);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON donation_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_requests_status ON donation_requests(status);