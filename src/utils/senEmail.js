import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,     // your gmail
    pass: process.env.GMAIL_PASS,     // app password, NOT real password
  },
});

const sendEmailWithPixel = async (to, subject, html) => {
  return transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  });
};

export default sendEmailWithPixel;