const { Sequelize } = require('sequelize');
require('dotenv').config();

const Op = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // bisa diganti true untuk debug query SQL
  }
);

module.exports = { Op };
