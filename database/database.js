const { Sequelize } = require('sequelize')
require('dotenv').config()

const connection = new Sequelize(process.env.DB_DATABSE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port:  process.env.DB_PORT,
    dialect: 'mysql'
})

module.exports = connection