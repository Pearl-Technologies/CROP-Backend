require("dotenv").config();
const nodemailer = require("nodemailer");

// sendEmail
module.exports.sendEmail = (body, res, message) => {

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE, //comment this line if you use custom server/domain
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      //comment out this one if you usi custom server/domain
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });

    transporter.verify(function (err, success) {
      if (err) {
        console.log(err.message, "on transporter.verify");
        return res.status(403).send({
          message: `Error happen when verify ${err.message}`,
        });
      } else {
        console.log("Server is ready to take our messages");
        transporter.sendMail(body, (err, data) => {
          if (err) {
            return res.status(403).send({
              message: `Error happen when sending email ${err.message}`,
            });
          } else {
            return res.send({
              message: message,
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.send("internal error");
  }
};
