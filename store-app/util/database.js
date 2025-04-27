const mysql = require('mysql2');

const {
  DB_MYSQL_HOST: host,
  DB_MYSQL_USER: user,
  DB_MYSQL_DATABASE: database,
  DB_MYSQL_PASSWORD: password
} = process.env;

const pool = mysql.createPool({ host, user, database, password });

module.exports = pool.promise();
