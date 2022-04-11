const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.from = `Le Viet Phat <${process.env.EMAIL_FROM}>`;
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
  }

  // 1. Create a new transport
  newTransport() {
    // production
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '933ba827ceb686',
        pass: '4af2049beb2be3',
      },
    });
  }

  // 2. Send
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject: subject,
    });

    const options = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3. Send email
    await this.newTransport().sendMail(options);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendResetPassword() {
    await this.send(
      'resetPassword',
      'Your reset password token (will expire in 10 minutes).'
    );
  }
};

// const sendEmail = async (user, subject, text) => {
//   // 1. Create transporter
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//       user: '933ba827ceb686',
//       pass: '4af2049beb2be3',
//     },
//   });

//   // 2. Options
//   const options = {
//     from: 'Phat Le <admin@example.com>',
//     to: user.email,
//     subject: subject,
//     text: text,
//   };

//   // 3. Send email
//   await transporter.sendMail(options);
// };
