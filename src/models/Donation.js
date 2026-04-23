/**
 * Model para Doações.
 * Gerencia operações CRUD de doações no banco de dados PostgreSQL.
 */

import pool from "../config/database.js";

class Donation {
  /**
   * Cria uma nova doação no banco.
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
      cep,
      status = "available",
    } = donationData;

    const query = `
      INSERT INTO donations (user_id, category, description, quantity, photo_url, city, cep, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id, user_id, category, description, quantity, photo_url, city, cep, status, created_at
    `;

    try {
      const result = await pool.query(query, [
        user_id,
        category,
        description,
        quantity,
        photo_url,
        city,
        cep,
        status,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar doação:", error.message);
      throw error;
    }
  }

  /**
   * Lista todas as doações com filtros opcionais.
   * @param {Object} filters - {category, city, status}
   * @returns {Array} Lista de doações
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT d.id, d.user_id, u.name as donor_name, d.category, d.description,
             d.quantity, d.photo_url, d.city, d.cep, d.status, d.created_at
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

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Erro ao listar doações:", error.message);
      throw error;
    }
  }

  /**
   * Busca uma doação específica por ID.
   * @param {number} id - ID da doação
   * @returns {Object|null} Doação encontrada ou null
   */
  static async findById(id) {
    const query = `
      SELECT d.id, d.user_id, u.name as donor_name, u.email as donor_email,
             d.category, d.description, d.quantity, d.photo_url, d.city, d.cep, d.status, d.created_at
      FROM donations d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = $1
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar doação:", error.message);
      throw error;
    }
  }

  /**
   * Atualiza uma doação existente.
   * @param {number} id - ID da doação
   * @param {number} user_id - ID do usuário (verificação)
   * @param {Object} updateData - Dados a atualizar
   * @returns {Object|null} Doação atualizada ou null
   */
  static async update(id, user_id, updateData) {
    // Verifica se pertence ao usuário
    const checkQuery = `SELECT user_id FROM donations WHERE id = $1`;
    try {
      const checkResult = await pool.query(checkQuery, [id]);
      if (!checkResult.rows[0] || checkResult.rows[0].user_id !== user_id) {
        return null;
      }

      const { category, description, quantity, photo_url, status, city, cep } = updateData;
      const query = `
        UPDATE donations
        SET category = COALESCE($1, category),
            description = COALESCE($2, description),
            quantity = COALESCE($3, quantity),
            photo_url = COALESCE($4, photo_url),
            status = COALESCE($5, status),
            city = COALESCE($6, city),
            cep = COALESCE($7, cep)
        WHERE id = $8
        RETURNING id, user_id, category, description, quantity, photo_url, city, cep, status, created_at
      `;

      const result = await pool.query(query, [
        category,
        description,
        quantity,
        photo_url,
        status,
        city,
        cep,
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao atualizar doação:", error.message);
      throw error;
    }
  }

  /**
   * Deleta uma doação.
   * @param {number} id - ID da doação
   * @param {number} user_id - ID do usuário
   * @returns {boolean} True se deletado
   */
  static async delete(id, user_id) {
    const checkQuery = `SELECT user_id FROM donations WHERE id = $1`;
    try {
      const checkResult = await pool.query(checkQuery, [id]);
      if (!checkResult.rows[0] || checkResult.rows[0].user_id !== user_id) {
        return false;
      }

      const deleteQuery = `DELETE FROM donations WHERE id = $1`;
      await pool.query(deleteQuery, [id]);
      return true;
    } catch (error) {
      console.error("Erro ao deletar doação:", error.message);
      throw error;
    }
  }

  /**
   * Busca doações de um usuário específico.
   * @param {number} user_id - ID do usuário
   * @returns {Array} Lista de doações do usuário
   */
  static async findByUserId(user_id) {
    const query = `
      SELECT id, user_id, category, description, quantity, photo_url, city, cep, status, created_at
      FROM donations
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    try {
      const result = await pool.query(query, [user_id]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar doações do usuário:", error.message);
      throw error;
    }
  }
}

export default Donation;
