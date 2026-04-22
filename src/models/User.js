/**
 * Modelo de dados para usuários.
 * Define métodos estáticos para interagir com a tabela 'users' no banco de dados.
 * Segue o padrão Active Record, onde cada método representa uma operação CRUD.
 * Usado pelos controllers para criar, buscar e manipular dados de usuários.
 */

import pool from "../config/database.js"; // Pool de conexões do banco

class User {
  /**
   * Cria um novo usuário no banco de dados.
   * Usado no controller de registro para inserir dados do novo usuário.
   * Retorna os dados do usuário criado (sem senha).
   * @param {Object} userData - Dados do usuário {name, email, password}
   * @returns {Object} Dados do usuário criado
   */
  static async create({ name, email, password }) {
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `;
    const values = [name, email, password];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Busca um usuário pelo email.
   * Usado no login para verificar se o usuário existe e obter a senha hasheada.
   * Também usado no registro para verificar se o email já está cadastrado.
   * @param {string} email - Email do usuário
   * @returns {Object|null} Dados do usuário ou null se não encontrado
   */
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  /**
   * Busca um usuário pelo ID.
   * Usado para obter o perfil do usuário autenticado, retornando apenas dados seguros.
   * @param {number} id - ID do usuário
   * @returns {Object|null} Dados do usuário (sem senha) ou null se não encontrado
   */
  static async findById(id) {
    const query = "SELECT id, name, email, created_at FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default User;
