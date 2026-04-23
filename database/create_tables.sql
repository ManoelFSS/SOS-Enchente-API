-- Script de criação de tabelas do sistema API SOS
-- Use este arquivo para gerar todas as tabelas necessárias e referências entre elas.

-- Tabela de usuários (autenticação básica)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para buscar usuário por email rapidamente
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Tabela de perfis de usuário (informações pessoais adicionais)
CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio VARCHAR(1000),
  phone VARCHAR(30),
  address VARCHAR(255),
  city VARCHAR(100),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);

-- Tabela de doações
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

CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_category ON donations(category);
CREATE INDEX IF NOT EXISTS idx_donations_city ON donations(city);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);

-- Tabela de requisições de doação
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

CREATE INDEX IF NOT EXISTS idx_requests_user_id ON donation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_category ON donation_requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_city ON donation_requests(city);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON donation_requests(urgency);
CREATE INDEX IF NOT_EXISTS idx_requests_status ON donation_requests(status);
