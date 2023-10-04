const nodemailer = require("nodemailer");
const { smtpUser, smtpPassword } = require("../secret");
const createHttpError = require("http-errors");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

const sendMail = async (mailData) => {
  try {
    const { email, subject, html } = mailData;
    const mailOptions = {
      from: "fsecommerce@example.com", // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw createHttpError(500, "Verification mail not sent");
  }
};

module.exports = sendMail;
