import { pool } from '../../config/db.js';

export async function createInvoice(userId,data){
   const {client_id,description,amount,due_date} = data;
   const query = `
   INSERT INTO invoices (user_id,client_id,description,amount,due_date) VALUES($1,$2,$3,$4,$5) RETURNING *`;
   const {rows} = await pool.query(query,[
      userId,
      client_id,
      description,
      amount,
      due_date
   ])
   return rows[0];
}
export async function getInvoice(userId){
   const {rows} = await pool.query(`SELECT * FROM invoices WHERE user_id =$1 ORDER BY created_at DESC`,[userId]);
   return rows;
}

export async function updateInvoiceStatus(id,status){
   const {rows} = await pool.query(`UPDATE invoices SET status = $1 WHERE id =$2 RETURNING *`,[status,id]);
   return rows[0];
}

export async function findInvoiceById(id,userId){
   const {rows} = await pool.query(`SELECT * FROM invoices WHERE id =$1 AND user_id =$2`,[id,userId]);
   return rows[0];
}
export async function countInvoicesByUser(userId) {
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM invoices WHERE user_id = $1`,
    [userId]
  );
  return parseInt(rows[0].count, 10);
}