const mailer = require("nodemailer");
const { MAILER_EMAIL, MAILER_PASSWORD } = require("../configs/mailer.configs");

const sendMail = async (mail) => {
  let transporter = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: MAILER_EMAIL,
      pass: MAILER_PASSWORD,
    },
    disableUrlAccess: true,
    disableFileAccess: true,
  });

  await transporter.sendMail(mail);
};

const emailTemplate = async (email, data = { subject, text, html }) => {
  const { subject, text, html } = data;

  const mail = {
    from: MAILER_EMAIL,
    to: email,
    subject: subject,
    text: text,
    html: html,
  };
  const rta = await sendMail(mail);

  return rta;
};

module.exports = { sendMail: emailTemplate };
