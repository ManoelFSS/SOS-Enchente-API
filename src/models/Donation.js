/**
 * Model para Doações.
 * Gerencia operações CRUD de doações no banco de dados.
 * Doações são itens oferecidos por usuários para ajudar pessoas em situação de risco.
 */

import pool from "../config/database.js";

class Donation {
  /**
   * Cria uma nova doação no banco.
   * Registra o que está sendo doado, quantidade, categoria e foto.
   * @param {Object} donationData - {user_id, category, description, quantity, photo_url, city, status}
   * @returns {Object} Doação criada com ID
   */
  static async create(donationData) {
    const {
      user_id,
      category,
      description,
      quantity,
      photo_url,
      city,
      status,
    } = donationData;
    const query = `
      INSERT INTO donations (user_id, category, description, quantity, photo_url, city, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, user_id, category, description, quantity, photo_url, city, status, created_at
    `;
    const values = [
      user_id,
      category,
      description,
      quantity,
      photo_url,
      city,
      status,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Lista todas as doações disponíveis com filtros opcionais.
   * Pode filtrar por categoria, cidade ou status.
   * @param {Object} filters - {category, city, status}
   * @returns {Array} Lista de doações
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT d.id, d.user_id, u.name as donor_name, d.category, d.description, 
             d.quantity, d.photo_url, d.city, d.status, d.created_at
      FROM donations d
      JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.category) {
      query += ` AND d.category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.city) {
      query += ` AND d.city ILIKE $${paramCount}`;
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND d.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    query += ` ORDER BY d.created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Busca uma doação específica por ID.
   * @param {number} id - ID da doação
   * @returns {Object|null} Doação encontrada ou null
   */
  static async findById(id) {
    const query = `
      SELECT d.id, d.user_id, u.name as donor_name, u.email as donor_email, 
             d.category, d.description, d.quantity, d.photo_url, d.city, d.status, d.created_at
      FROM donations d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Atualiza uma doação existente.
   * Apenas o doador pode atualizar sua doação.
   * @param {number} id - ID da doação
   * @param {number} user_id - ID do usuário (para verificação de autorização)
   * @param {Object} updateData - Dados a atualizar
   * @returns {Object|null} Doação atualizada ou null
   */
  static async update(id, user_id, updateData) {
    // Verifica se a doação pertence ao usuário
    const checkQuery = `SELECT user_id FROM donations WHERE id = $1`;
    const checkResult = await pool.query(checkQuery, [id]);

    if (!checkResult.rows[0] || checkResult.rows[0].user_id !== user_id) {
      return null;
    }

    const { category, description, quantity, photo_url, status } = updateData;
    const query = `
      UPDATE donations
      SET category = COALESCE($1, category),
          description = COALESCE($2, description),
          quantity = COALESCE($3, quantity),
          photo_url = COALESCE($4, photo_url),
          status = COALESCE($5, status)
      WHERE id = $6
      RETURNING id, user_id, category, description, quantity, photo_url, city, status, created_at
    `;
    const values = [category, description, quantity, photo_url, status, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Deleta uma doação.
   * Apenas o doador pode deletar sua doação.
   * @param {number} id - ID da doação
   * @param {number} user_id - ID do usuário
   * @returns {boolean} True se deletado, false caso contrário
   */
  static async delete(id, user_id) {
    const checkQuery = `SELECT user_id FROM donations WHERE id = $1`;
    const checkResult = await pool.query(checkQuery, [id]);

    if (!checkResult.rows[0] || checkResult.rows[0].user_id !== user_id) {
      return false;
    }

    const query = `DELETE FROM donations WHERE id = $1`;
    await pool.query(query, [id]);
    return true;
  }

  /**
   * Busca doações de um usuário específico.
   * @param {number} user_id - ID do usuário
   * @returns {Array} Lista de doações do usuário
   */
  static async findByUserId(user_id) {
    const query = `
      SELECT id, user_id, category, description, quantity, photo_url, city, status, created_at
      FROM donations
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }
}

export default Donation;
