const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-aditya', 'root', 'Fahi@987', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;