const Sequelize = require('sequelize');

const sequelize = require('../../util/database_sql');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: Sequelize.STRING,
  email: Sequelize.STRING
});

module.exports = User;
