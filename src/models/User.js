/**
 * Modelo de dados para usuários.
 * Define métodos estáticos para interagir com a tabela 'users' no banco de dados PostgreSQL.
 * Cada método representa uma operação CRUD.
 */

import pool from "../config/database.js";

class User {
  /**
   * Cria um novo usuário no banco de dados.
   * @param {Object} userData - {name, email, password}
   * @returns {Object} Dados do usuário criado
   */
  static async create({ name, email, password }) {
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `;
    try {
      const result = await pool.query(query, [name, email, password]);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar usuário:", error.message);
      throw error;
    }
  }

  /**
   * Busca um usuário pelo email.
   * @param {string} email - Email do usuário
   * @returns {Object|null} Usuário encontrado ou null
   */
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error.message);
      throw error;
    }
  }

  /**
   * Busca um usuário pelo ID.
   * @param {number} id - ID do usuário
   * @returns {Object|null} Usuário encontrado ou null
   */
  static async findById(id) {
    const query = "SELECT id, name, email, created_at FROM users WHERE id = $1";
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error.message);
      throw error;
    }
  }
}

export default User;
