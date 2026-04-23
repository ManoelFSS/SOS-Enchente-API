/**
 * Model para Requisições de Doação.
 * Gerencia operações CRUD de requisições no banco de dados PostgreSQL.
 */

import pool from "../config/database.js";

class DonationRequest {
  /**
   * Cria uma nova requisição de doação no banco.
   * Registra o que o usuário está precisando, quantidade e urgência.
   * @param {Object} requestData - {user_id, category, description, quantity, urgency, city, status}
   * @returns {Object} Requisição criada com ID
   */
  static async create(requestData) {
    const {
      user_id,
      category,
      description,
      quantity,
      urgency,
      city,
      status = "open",
    } = requestData;

    const query = `
      INSERT INTO donation_requests (user_id, category, description, quantity, urgency, city, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, user_id, category, description, quantity, urgency, city, status, created_at
    `;

    try {
      const result = await pool.query(query, [
        user_id,
        category,
        description,
        quantity,
        urgency,
        city,
        status,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar requisição:", error.message);
      throw error;
    }
  }

  /**
   * Lista todas as requisições com filtros opcionais.
   * @param {Object} filters - {category, city, urgency, status}
   * @returns {Array} Lista de requisições
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT r.id, r.user_id, u.name as requester_name, r.category, r.description,
             r.quantity, r.urgency, r.city, r.status, r.created_at
      FROM donation_requests r
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.category) {
      query += ` AND r.category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.city) {
      query += ` AND r.city ILIKE $${paramCount}`;
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.urgency) {
      query += ` AND r.urgency = $${paramCount}`;
      values.push(filters.urgency);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND r.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    query += ` ORDER BY CASE WHEN r.urgency = 'critical' THEN 1 WHEN r.urgency = 'high' THEN 2 WHEN r.urgency = 'medium' THEN 3 ELSE 4 END, r.created_at DESC`;

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Erro ao listar requisições:", error.message);
      throw error;
    }
  }

  /**
   * Busca uma requisição específica por ID.
   * @param {number} id - ID da requisição
   * @returns {Object|null} Requisição encontrada ou null
   */
  static async findById(id) {
    const query = `
      SELECT r.id, r.user_id, u.name as requester_name, u.email as requester_email,
             r.category, r.description, r.quantity, r.urgency, r.city, r.status, r.created_at
      FROM donation_requests r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar requisição:", error.message);
      throw error;
    }
  }

  /**
   * Atualiza uma requisição existente.
   * @param {number} id - ID da requisição
   * @param {number} user_id - ID do usuário
   * @param {Object} updateData - Dados a atualizar
   * @returns {Object|null} Requisição atualizada ou null
   */
  static async update(id, user_id, updateData) {
    const checkQuery = `SELECT user_id FROM donation_requests WHERE id = $1`;
    try {
      const checkResult = await pool.query(checkQuery, [id]);
      if (!checkResult.rows[0] || checkResult.rows[0].user_id !== user_id) {
        return null;
      }

      const { category, description, quantity, urgency, status } = updateData;
      const query = `
        UPDATE donation_requests
        SET category = COALESCE($1, category),
            description = COALESCE($2, description),
            quantity = COALESCE($3, quantity),
            urgency = COALESCE($4, urgency),
            status = COALESCE($5, status)
        WHERE id = $6
        RETURNING id, user_id, category, description, quantity, urgency, city, status, created_at
      `;

      const result = await pool.query(query, [
        category,
        description,
        quantity,
        urgency,
        status,
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao atualizar requisição:", error.message);
      throw error;
    }
  }

  /**
   * Deleta uma requisição.
   * @param {number} id - ID da requisição
   * @param {number} user_id - ID do usuário
   * @returns {boolean} True se deletado
   */
  static async delete(id, user_id) {
    const checkQuery = `SELECT user_id FROM donation_requests WHERE id = $1`;
    try {
      const checkResult = await pool.query(checkQuery, [id]);
      if (!checkResult.rows[0] || checkResult.rows[0].user_id !== user_id) {
        return false;
      }

      const deleteQuery = `DELETE FROM donation_requests WHERE id = $1`;
      await pool.query(deleteQuery, [id]);
      return true;
    } catch (error) {
      console.error("Erro ao deletar requisição:", error.message);
      throw error;
    }
  }

  /**
   * Busca requisições de um usuário específico.
   * @param {number} user_id - ID do usuário
   * @returns {Array} Lista de requisições do usuário
   */
  static async findByUserId(user_id) {
    const query = `
      SELECT id, user_id, category, description, quantity, urgency, city, status, created_at
      FROM donation_requests
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    try {
      const result = await pool.query(query, [user_id]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar requisições do usuário:", error.message);
      throw error;
    }
  }

  /**
   * Busca requisições por nível de urgência e cidade.
   * @param {string} urgency - Nível de urgência
   * @param {string} city - Nome da cidade
   * @returns {Array} Requisições que correspondem aos critérios
   */
  static async findByCritical(urgency, city) {
    const query = `
      SELECT r.id, r.user_id, u.name as requester_name, r.category, r.description,
             r.quantity, r.urgency, r.city, r.status, r.created_at
      FROM donation_requests r
      JOIN users u ON r.user_id = u.id
      WHERE r.urgency = $1 AND r.city ILIKE $2 AND r.status = 'open'
      ORDER BY r.created_at DESC
    `;

    try {
      const result = await pool.query(query, [urgency, `%${city}%`]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar requisições críticas:", error.message);
      throw error;
    }
  }
}

export default DonationRequest;
