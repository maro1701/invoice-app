import { pool } from '../../config/db.js';

export async function createClient(userId, data) {
  const { name, email, phone } = data;

  const query = `
    INSERT INTO clients (user_id, name, email, phone)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [userId, name, email, phone]);
  return rows[0];
}

export async function getClientsByUser(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

export async function findClientById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM clients WHERE id = $1`,
    [id]
  );
  return rows[0];
}