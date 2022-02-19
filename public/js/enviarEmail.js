var nodemailer = require('nodemailer');

async function main(emailUser, id) {
  let url = `https://guiaspergunta.herokuapp.com/pergunta/${id}`
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



module.exports = main