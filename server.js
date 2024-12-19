const express = require("express");
const bp = require("body-parser");
const nm = require("nodemailer");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const phrases = [
  "Pendejo el que lea.",
  "Jaja, caíste.",
  "Gracias pero tengo novia :)",
  "Los bobos no se resfrían.",
];

app.use(bp.json());
app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const emailCredentials = {
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  service: process.env.SERVICE,
};

const transp = nm.createTransport({
  service: emailCredentials.service,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  logger: true,
  debug: true,
  ignoreTLS: false,
  auth: {
    user: emailCredentials.email,
    pass: emailCredentials.password,
  },
});

const sendEmailNotification = async (visitorItem) => {
  if (!emailCredentials.email || !emailCredentials.password || !emailCredentials.service) {
    console.error("ENVIRONMENT ERROR")
    console.log(emailCredentials)
  }
  
  const mailOptions = {
    from: emailCredentials.email,
    to: emailCredentials.email,
    subject: "QR Code Scanned!",
    headers: {
      "X-Priority": "1",
      Importance: "high",
      Priority: "urgent",
    },
    text: `Someone scanned your QR code! These are the details: \n
        - Visitor IP Address: ${req.headers["x-forwarded-for"] || req.ip}
        - User Details: ${visitorItem.user}
        - Visitor's language: ${visitorItem.language}
        - Visit time: ${visitorItem.time}
    `,
  };

  const { error, info } = await transp.sendMail(mailOptions)

  if (error) return console.error("error sending" + error);
  return console.log("email sent: " + info);
};

app.get("/", (req, res) => {
  const visitorItem = {
    ip: req.ip,
    user: req.headers["user-agent"],
    language: req.headers["accept-language"],
    time: new Date().toLocaleDateString(),
  };

  sendEmailNotification(visitorItem);
  res.render("index", { phrases });
});

app.listen(PORT, () => console.log("App is running on port ", PORT));

module.exports = app