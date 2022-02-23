const express = require('express')
const res = require('express/lib/response')
const app = express()

const moment = require('moment');
const tz = require('moment-timezone')
const Swal = require('sweetalert2')


const connection = require('./database/database')
const Perguntas = require('./database/Perguntas')
const Respostas = require('./database/Respostas')

const nodemailer = require('nodemailer');
const enviarEmail = require('./public/js/enviarEmail')


const bodyParser = require('body-parser');
const req = require('express/lib/request');


connection
    .authenticate()
    .then(() => {
        console.log('CONEXÃO ESTABELECIDA')
    })
    .catch((msgError) => {
        console.log(`error: ${msgError}`)

    })


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {

    Perguntas.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then((perguntas) => {

        Respostas.findAll({
            raw: true, order: [
                ['id', 'DESC']
            ]
        })
            .then((dadosResposta) => {
                res.render('index', {
                    perguntas: perguntas,
                    respostas: dadosResposta
                })

            })

    })

})



app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

app.get('/pergunta/:id', (req, res) => {

    let id = req.params.id

    Perguntas.findOne({ raw: true, where: { id: id } })
        .then((dadosPergunta) => {

            if (dadosPergunta) {



                Respostas.findAll({
                    order: [
                        ['id', 'DESC']
                    ], where: { perguntaID: id }
                })
                    .then((dadosResposta) => {

                        if (dadosResposta) {
                            res.render('pergunta', {
                                dadosPergunta: dadosPergunta,
                                dadosResposta: dadosResposta


                            })

                        } else {
                            res.render('pergunta', {
                                dadosPergunta: dadosPergunta

                            })
                        }


                    })


            } else {

                res.render('pergunta', {
                    dadosPergunta: {
                        title: 'Pergunta não encontrada ou inexistente',
                        description: 'Pergunta não encontrada ou inexistente'
                    }
                })

            }

        })


})

app.post('/salvarpergunta', (req, res) => {

    let hora_brasilia = moment().tz('America/Sao_Paulo').format()

    let titulo = req.body.title.trim()
    let description = req.body.description.trim()
    let name = req.body.name.trim()
    let email = req.body.email.trim()


    Perguntas.create({
        title: titulo,
        description: description,
        email: email,
        name: name,
        datacriacao: hora_brasilia

    }).then(() => {
        enviarEmail.notificationQuestion(titulo, description, name)
        res.redirect('/')
    })
    .catch((error) => {
        
    })

})




app.post('/enviarreposta', (req, res) => {

    let resposta = req.body.response
    let perguntaID = req.body.perguntaID
    let autorResposta = req.body.autorResposta
    let hora_brasilia = moment().tz('America/Sao_Paulo').format()



    Respostas.create({
        body: resposta,
        perguntaID: perguntaID,
        autorResposta: autorResposta,
        datacriacao: hora_brasilia
    })
        .then(() => {

            Perguntas.findOne({ raw: true, where: { id: perguntaID } })
                .then((dados) => {
                    if (dados.email) {
                        enviarEmail.main(dados.email, perguntaID)
                    } else {
                        console.log('não possui email cadastrado')
                    }
                })

            res.redirect('/pergunta/' + perguntaID)
        })
        .catch((error) => {
            console.log(error)
        })
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`App rodando na porta 8080`)
})

