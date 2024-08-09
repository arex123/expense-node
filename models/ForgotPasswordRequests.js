const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequests', {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  userId: {type:Sequelize.STRING,
    allowNull:false
  },
  isactive: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
 
});

module.exports = ForgotPasswordRequests;