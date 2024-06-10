require("dotenv").config();

const MailerConfigs = {
  MAILER_EMAIL: process.env.MAILER_EMAIL,
  MAILER_PASSWORD: process.env.MAILER_PASSWORD,
};

module.exports = MailerConfigs;
