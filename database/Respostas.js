const { Sequelize } = require('sequelize')

const connection = require('./database')

const Resposta = connection.define('respostas', {
    body : {
        type : Sequelize.TEXT,
        allowNull : false
    },
    perguntaID : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    autorResposta : {
        type : Sequelize.TEXT,
        allowNull : false
    },
    datacriacao : {
        type : Sequelize.STRING,
        allowNull : false
    }
}, {})


Resposta.sync({force : false})
module.exports = Resposta