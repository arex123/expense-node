const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  isPremiumUser: { type: Sequelize.BOOLEAN, defaultValue:0 },
  totalExpense: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
});

module.exports = User;
