const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-expense', 'root', 'Fahi@987', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;