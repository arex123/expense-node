const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const FilesUploaded = sequelize.define("filesUploaded", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = FilesUploaded;
