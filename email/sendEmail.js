const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.EMAIL_RECIPIENT,
      subject: subject,
      text: text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${result.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
  }
}

module.exports = sendEmail;
