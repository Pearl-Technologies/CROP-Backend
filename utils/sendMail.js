const nodemailer = require("nodemailer")
const { Otp } = require("../models/businessModel/Otp")

const sendMail = (toEmail, subject, msg, resMsg, otpType, userType, res) => {
    var otp = Math.floor(100000 + Math.random() * 900000)
    console.log({otp})
  const transporter = nodemailer.createTransport({
    // service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })
  console.log({toEmail, subject, msg, resMsg})
  const mailOptions = {
    from: "vickystater1@gmail.com",
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
