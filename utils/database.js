const Sequelize = require('sequelize');

console.log(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSD, process.env.DB_HOST)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSD, {
  dialect: 'mysql',
  host: process.env.DB_HOST
});

module.exports = sequelize;