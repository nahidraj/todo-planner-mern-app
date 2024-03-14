const nodemailer = require("nodemailer");

const SendEmailUtility = async (emailTo, emailSubject, emailText) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "nahidraj.web@gmail.com",
      pass: "ikyf bqhw xwco vtdq ",
    },
  });

  const mailOptions = {
    from: "Todo Planner <nahidraj.web@gmail.com>",
    to: emailTo,
    subject: emailSubject,
    text: emailText,
  }

  return await transporter.sendMail(mailOptions);
}

module.exports = SendEmailUtility;