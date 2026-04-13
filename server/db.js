const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:               (process.env.MYSQLHOST     || 'localhost').trim(),
  port:               Number((process.env.MYSQLPORT || '3306').trim()),
  user:               (process.env.MYSQLUSER     || 'root').trim(),
  password:           (process.env.MYSQLPASSWORD || '').trim(),
  database:           (process.env.MYSQLDATABASE || 'opsportal').trim(),
  waitForConnections: true,
  connectionLimit:    10,
  timezone:           'Z',
});

module.exports = pool;
