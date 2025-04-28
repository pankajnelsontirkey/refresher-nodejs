const { Sequelize } = require('sequelize');

const {
  DB_MYSQL_HOST: host,
  DB_MYSQL_USER: user,
  DB_MYSQL_DATABASE: database,
  DB_MYSQL_PASSWORD: password
} = process.env;

const sequelize = new Sequelize(database, user, password, {
  dialect: 'mysql',
  host: host
});

module.exports = sequelize;
