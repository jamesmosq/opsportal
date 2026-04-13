const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:               process.env.MYSQLHOST     || 'localhost',
  port:               Number(process.env.MYSQLPORT) || 3306,
  user:               process.env.MYSQLUSER     || 'root',
  password:           process.env.MYSQLPASSWORD || '',
  database:           process.env.MYSQLDATABASE || 'opsportal',
  waitForConnections: true,
  connectionLimit:    10,
  timezone:           'Z',
});

module.exports = pool;
