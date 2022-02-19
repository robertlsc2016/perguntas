const express = require('express')
const res = require('express/lib/response')
const app = express()

// DATABASES
const connection = require('./database/database')
const Perguntas = require('./database/Perguntas')
const Respostas = require('./database/Respostas')

var nodemailer = require('nodemailer');
const enviarEmail = require('./public/js/enviarEmail')

connection
    .authenticate()
    .then(() => {
        console.log('CONEXÃO ESTABELECIDA')
    })
    .catch((msgError) => {
        console.log(`error: ${msgError}`)

    })


// TRADUZ OS DADOS ENVIADOS PELO FORMULÁRIO EM JS PARA SER USADO NO BACKEND
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// MOTOR DE HTML - RENDERIZADOR DE HTML
app.set('view engine', 'ejs')

app.use(express.static('public'))

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

    let titulo = req.body.title
    let description = req.body.description
    let name = req.body.name
    let email = req.body.email
    let id = req.body.perguntaID

    Perguntas.create({
        title: titulo,
        description: description,
        email: email,
        name: name

    }).then(() => {
        enviarEmail.notificationQuestion(titulo, description, id, name )
        res.redirect('/')
    })
})


app.post('/enviarreposta', (req, res) => {

    let resposta = req.body.response
    let perguntaID = req.body.perguntaID
    let autorResposta = req.body.autorResposta

    

    Respostas.create({
        body: resposta,
        perguntaID: perguntaID,
        autorResposta: autorResposta
    })
        .then(() => {

            Perguntas.findOne({ raw: true, where: { id: perguntaID } })
                .then((dados) => {
                    if (dados.email) {
                        enviarEmail(dados.email, perguntaID)
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

