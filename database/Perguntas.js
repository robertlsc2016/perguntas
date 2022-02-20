// MODEL : REPRESENTAÇÃO DA TABELA DO BANCO NO JS

const { Sequelize } = require('sequelize')
const connection = require('./database')

const Perguntas = connection.define('perguntas',{
    title: {
        type : Sequelize.STRING,
        allowNull : false
    },
    description : {
        type : Sequelize.TEXT,
        allowNull : false
    },
    email: {
        type : Sequelize.STRING,
        allowNull : true
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    datacriacao : {
        type : Sequelize.STRING,
        allowNull : false
    }
}, {})

Perguntas.sync({force : false}).then(() => {})
module.exports = Perguntas