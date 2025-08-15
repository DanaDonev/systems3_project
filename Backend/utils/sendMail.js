const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'info.petsitter.si@gmail.com',
    pass: 'qfvarfpyheeoloub', // Use an app password, not your real password!
  },
});

async function sendMail({ to, subject, text, html }) {
  await transporter.sendMail({
    from: '"Petsitter" <info.petsitter.si@gmail.com>',
    to,
    subject,
    text,
    html,
  });
}

module.exports = sendMail;