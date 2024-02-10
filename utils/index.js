const {nodemailerTransport} = require("../service/nodemailer");

const sendMail = (data) => {
  return nodemailerTransport.sendMail({
    from: data?.from || process.env.MAIL_USER,
    to: data?.to,
    subject: data?.subject,
    text: data?.text,
    html: data?.html,
    attachments: data?.attachments,
  });
};
module.exports = { sendMail };
