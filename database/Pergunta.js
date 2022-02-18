// MODEL : REPRESENTAÇÃO DA TABELA DO BANCO NO JS

const { Sequelize } = require('sequelize')
const connection = require('./database')

const Pergunta = connection.define('pergunta',{
    title: {
        type : Sequelize.STRING,
        allowNull : false
    },
    description : {
        type : Sequelize.TEXT,
        allowNull : false
    }
}, {})

Pergunta.sync({force : false}).then(() => {})
module.exports = Pergunta