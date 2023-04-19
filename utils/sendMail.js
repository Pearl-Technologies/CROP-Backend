const nodemailer = require("nodemailer")
const { Otp } = require("../models/businessModel/Otp")

const sendMail = (toEmail, subject, msg, resMsg, otpType, userType, res) => {
    var otp = Math.floor(100000 + Math.random() * 900000)
  console.log({ otp })

  const transporter = nodemailer.createTransport({
    // service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
  console.log({ toEmail, subject, msg, resMsg })
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: subject,
    text: msg + " " + otp,
  }

  transporter.sendMail(mailOptions, async(err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).send({
        msg: "Enter the correct email id",
        status: "false",
        data: [],
      })
    } else {
        console.log("one")
        const otpData = new Otp({
            email: toEmail,
            otp: otp,
            otpType: otpType,
            userType: userType,
        })
        console.log("two")
        await otpData.save();
        console.log({otpData})
        return res.status(200).send({ msg: resMsg, status: "true" })
    }
  })
}

module.exports = { sendMail }
