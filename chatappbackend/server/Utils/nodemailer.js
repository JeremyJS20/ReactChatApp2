
const mailer = require('nodemailer');
let transporter = '';

class nodemailer{
  constructor() {

    if (nodemailer.exists) {
      return nodemailer.instance;
    }
    nodemailer.instance = this;
    nodemailer.exists = true;

    transporter = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
      auth: {
        user: process.env.NODEMAILER_AUTH_EMAIL, 
        pass: process.env.NODEMAILER_AUTH_PASS
      },
    });

    return this;
  }

   sendEmail(object) {
    return transporter.sendMail(object, (err, response) => {
      if (err) {
        throw err
      } else {
        return;
      }
    });
  }
}

module.exports = nodemailer;