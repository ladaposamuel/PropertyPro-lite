import nodemailer from 'nodemailer';

/**
 * Function for sending email notification to users
 * @param {string} email - email the message is to be sent to
 * @param {object} options email data including user's email,
 * message body and message content
 * @return {void}
 */
const sendEmailNotification = (email, options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'PropertPro-Lite',
    to: email,
    subject: options.subject,
    html: options.message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
    return info.response;
  });
};

export default sendEmailNotification;
