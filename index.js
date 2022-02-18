const express = require('express')
const res = require('express/lib/response')
const app = express()
// require('dotenv').config()

// DATABASES
const connection = require('./database/database')
const Perguntar = require('./database/Pergunta')

const Respostas = require('./database/Respostas')

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

    // raw = faz a busca pura nos dados | order : ordena os dados
    Perguntar.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then((perguntas) => {
        res.render('index', {
            perguntas: perguntas
        })
    })

})




app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

app.get('/pergunta/:id', (req, res) => {
    let id = req.params.id

    Perguntar.findOne({ raw: true, where: { id: id } })
        .then((dadosPergunta) => {

            if (dadosPergunta) {



                Respostas.findAll({ where: { perguntaID : id } })
                .then((dadosResposta) => {

                    if(dadosResposta){
                        console.log(dadosResposta.length)
                        res.render('pergunta', {
                            dadosPergunta: dadosPergunta,
                            dadosResposta : dadosResposta
                            
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

    Perguntar.create({
        title: titulo,
        description: description
    }).then(() => {
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
            res.redirect('/pergunta/' + perguntaID)
        })
        .catch((error) => {
            console.log(error)
        })
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`App rodando na porta 8080`)
})

