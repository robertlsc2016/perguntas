var nodemailer = require('nodemailer');

async function main(emailUser, id) {
  let url = `https://perguntastk.herokuapp.com/pergunta/${id}`
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.umbler.com",
    port: 587,
    secure: false,
    auth: {
      user: 'guiaperguntas@perguntas.tk',
      pass: process.env.EMAIL_PASS,
    },
  });


  let info = await transporter.sendMail({
    from: 'guiaperguntas@perguntas.tk',
    to: emailUser,
    subject: "Responderam sua questão",
    text: "",
    html: 
    `
    <p>Olá, responderam sua questão.</p>
    <p>Acesse : </p> 
    <a href=${url}>${url}</a>
    <p>para visualizar a resposta </p>
    `

  });

}

async function notificationQuestion(title, description, name) {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.umbler.com",
    port: 587,
    secure: false,
    auth: {
      user: 'guiaperguntas@perguntas.tk',
      pass: process.env.EMAIL_PASS,
    },
  });


  let info = await transporter.sendMail({
    from: 'guiaperguntas@perguntas.tk',
    to: 'robertlsc2016@gmail.com',
    subject: "Fizeram uma pergunta no site",
    text: "Fizeram uma pergunta no site",
    html: 
    `
      <h2>Sr. Robert, fizeram uma pergunta. Que tal verificar?</h2>
      <br>
      <a href="https://perguntastk.herokuapp.com/" >https://perguntastk.herokuapp.com/</a>
      <hr>
      <div>
        <h3>Título : ${title}<h3>
        <p>Autor : ${name}</p>
        <p>Descrição : ${description}</p>
      </div>

    `

  });

}


module.exports = {main, notificationQuestion}