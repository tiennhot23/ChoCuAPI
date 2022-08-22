var nodemailer = require('nodemailer')

const mail = {}

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testmail24681357@gmail.com',
    pass: process.env.MAIL_PASSWORD_APP
  }
})

mail.sendMail = (email, title, content) => {
  var options = {
    from: 'OneRead',
    to: email,
    subject: title,
    text: content
  }
  transporter
    .sendMail(options)
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
}

module.exports = mail
