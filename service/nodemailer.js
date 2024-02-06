const nodemailer = require("nodemailer");
const config = {
  smtp: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
  },
  gmail: {
    service: "gmail",
    tls: { rejectUnauthorized: false },
  },
};

const MAIL_SERVICE = process.env.MAIL_SERVICE;

const nodemailerTransport = nodemailer.createTransport({
  ...config[MAIL_SERVICE],
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.PASS,
  },
});

module.exports = {
  nodemailerTransport,
};
