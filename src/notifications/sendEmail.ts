import nodemailer from 'nodemailer';

function getEmailConfig() {
  const username = process.env.EMAIL_USERNAME;
  const password = process.env.EMAIL_PASSWORD;
  const recipient = process.env.EMAIL_RECIPIENT;
  const service = process.env.EMAIL_SERVICE ?? 'gmail';

  if (!username || !password || !recipient) {
    return null;
  }

  return {
    password,
    recipient,
    service,
    username
  };
}

export async function sendEmail(subject: string, text: string): Promise<boolean> {
  const config = getEmailConfig();

  if (!config) {
    console.log('Email delivery skipped because EMAIL_USERNAME, EMAIL_PASSWORD, or EMAIL_RECIPIENT is missing.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: config.service,
    auth: {
      user: config.username,
      pass: config.password
    }
  });

  await transporter.sendMail({
    from: config.username,
    to: config.recipient,
    subject,
    text
  });

  return true;
}
