import {pool} from '../../config/db.js';

export async function createUser(email,passwordHash){
   const query = `
   INSERT INTO users (email,password_hash) VALUES($1,$2) RETURNING id,email`;
   const {rows} = await pool.query(query,[email,passwordHash]);
   return rows[0];
}

export async function findUserByEmail(email){
   const {rows} = await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);
   return rows[0];
}

export async function markUserAsPaid(userId){
   const {rows} = await pool.query(
      `UPDATE users SET is_paid = true WHERE id =$1 RETURNING *`,[userId]
   );
   return rows[0];
}