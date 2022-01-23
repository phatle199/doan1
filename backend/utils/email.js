const nodemailer = require('nodemailer');

const sendEmail = async (user, subject, text) => {
  // 1. Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '933ba827ceb686',
      pass: '4af2049beb2be3',
    },
  });

  // 2. Options
  const options = {
    from: 'Phat Le <admin@example.com>',
    to: user.email,
    subject: subject,
    text: text,
  };

  // 3. Send email
  await transporter.sendMail(options);
};

module.exports = sendEmail;
