import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Test1234',
  database: 'product_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
