const nodemailer = require('nodemailer');

const { MAILER_USER, MAILER_PASSWORD } = process.env;

exports.sendMail = ({ to, from, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: MAILER_USER,
      pass: MAILER_PASSWORD
    }
  });

  if (!to) {
    return Promise.reject('No receiver specified!');
  }

  const mailOptions = {
    from: from ?? MAILER_USER,
    to,
    subject: subject ?? 'Dummy Subject',
    text: text ?? 'Sample email text',
    html: html ?? '<h1>Email</h1><p>Sample email html</p>'
  };

  return transporter.sendMail(mailOptions);
};
