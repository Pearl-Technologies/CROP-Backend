const express = require("express");
const router = express.Router();
const { Otp, User, Token, Newsletter, MissingCrop, CommunicationPreference, Feedback, loginAttemp } = require("../models/User");
const {AccountNotificationCustomer, GeneralNotificationCustomer, ComplainNotificationCustomer, InvoicePaymentNotificationCustomer} = require("../models/notification");
const StateSchema = require('../models/State');
const { Cart } = require("../models/Cart")
const { Wishlist } = require("../models/Wishlist")
const {
  customerPaymentTracker,
} = require("../models/admin/PaymentTracker/paymentIdTracker");
const adminCustomerAccountNotification = require("../models/admin/notification/customerAccountNotification")
const adminGeneralAccountNotification = require("../models/admin/notification/customerGeneralNotification")
const adminCustomerPurchaseAndRedeemtionNotification = require("../models/admin/notification/customerPurchaseAndRedeemtionNotification")
const adminCustomerRequestAndComplainedNotification = require("../models/admin/notification/customerRequestAndComplainedNotification")
const { Product } = require("../models/businessModel/product");
const business = require("../models/businessModel/business");
var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
var shortid = require("shortid");
var fs = require("fs-extra");
const { readFileSync } = require("fs");
const accountSid = "AC31efbb78567dcc30e05243f5193c6da6";
const authToken = "160b8a1bf927b3fb4a71f8a4a7dff449";
const verifySid = "VAd7985f7bf02389316934069629c48aa3";
const client = require("twilio")(accountSid, authToken);
const pathName = process.cwd();
const { createCustomerAudit } = require("../controller/adminController/audit")
const {
  createMissingCropNotification,
} = require("../controller/businessController/businessNotification/compalintNotification")

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads")
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now())
  },
})

var upload = multer({ storage: storage })

router.put("/uploadpicture", async (req, res) => {
  try {
    if (fs.existsSync(pathName + "/uploads/" + req.files[0].originalname)) {
      return res.send({ message: "File name already Exist" })
    } else {
      const filesName = fs.createWriteStream(
        pathName + "/uploads/" + req.files[0].originalname
      )
      filesName.write(req.files[0].buffer)
      filesName.end()

      var obj = req.files[0].originalname
      let token = req.headers.authorization
      const token_data = await Token.findOne({ token: token })
      const result = await User.updateOne(
        { _id: token_data.user },
        {
          $set: {
            avatar: obj,
          },
        }
      )
      res.status(200).send({
        message: "Profile pic Updated successfully",
        status: "true",
        data: [],
      })
    }
  } catch (err) {
    //if any internal error occurs it will show error message
    res
      .status(500)
      .send({ message: "Internal Server error", status: "false", data: [] })
  }
})

router.get("/", async (req, res) => {
  return res.status(200).send("API works fine")
})

router.put("/resendotp", async (req, res) => {
  const email = req.body.email
  const phone = req.body.phone
  if (email) {
    var otp = Math.floor(100000 + Math.random() * 900000)
    const date = new Date();

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    const formattedDateTime = date.toLocaleString('en-US', options);
    const transporter = nodemailer.createTransport({
      // service: "Gmail",
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Generated",
      text: `Your one time email verification code is ${otp}, and is valid for 2 minutes.\n\n(Generated at ${formattedDateTime})\n\n\n
      ************************************\nThis is an auto-generated email. Do not reply to this email.`,
    }

    transporter.sendMail(mailOptions, async (err, result) => {
      if (err) {
        res.status(500).send({
          message: "Enter the correct email id",
          status: "false",
          data: [],
        })
      } else {
        const result = await Otp.updateOne(
          { email: email },
          { $set: { otp: otp, status: false } }
        )
        res.status(200).send({
          message: "otp sent successsfully",
          status: "true",
          data: [],
        })
      }
    })
  } else {
    //Phone OTP
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: "sms" })
      .then(verification => {
        res.status(200).send({
          message: "Otp sent successfully to ur phone number",
          status: "true",
          data: [],
        })
      })
      .then(() => {
        const readline = require("readline").createInterface({
          input: process.stdin,
          output: process.stdout,
        })
      })
  }
})

router.post("/emailphone", async (req, res) => {
  const phone = req.body.phone ? req.body.phone : ""
  const email = req.body.email ? req.body.email : ""

  //Add the status true when the otp is verified in the database

  var bool1 = 0
  var bool2 = 0

  if (email === "") {
    bool1 = 1
  }
  if (phone === "") {
    bool2 = 1
  }
  if (bool2 === 0) {
    const phoneExist = await User.findOne({ mobileNumber: phone })
    const businessMobile = await business.findOne({ mobile: phone })
    if (phoneExist)
      return res.status(409).send({
        message: "User with given phone number already exist",
        status: false,
      })
    if (businessMobile)
      return res.status(409).send({
        message: "User with given phone number already exist in business",
        status: false,
      })
  }
  if (bool1 === 0) {
    const emailExist = await User.findOne({ email: email })
    const businessEmail = await business.findOne({ email: email })
    if (emailExist)
      return res.status(409).send({
        message: "User with given email already exist",
        status: false,
      })
    if (businessEmail)
      return res
        .status(409)
        .send({ message: "User with given email already exist in business" })
  }

  if (email) {
    //Email OTP
    var otp = Math.floor(100000 + Math.random() * 900000)
    //   const mailTransport = nodemailer.createTransport({
    //     host: "smtpout.secureserver.net",
    //     secure: true,
    //     secureConnection: false, // TLS requires secureConnection to be false
    //     tls: {
    //         ciphers:'SSLv3'
    //     },
    //     requireTLS:true,
    //     port: process.env.EMAIL_PORT,
    //     debug: true,
    //     auth: {
    //         user: "put your godaddy hosted email here",
    //         pass: "put your email password here"
    //     }
    // });
    const date = new Date();

      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      const formattedDateTime = date.toLocaleString('en-US', options);
    const transporter = nodemailer.createTransport({
      // service: "Gmail",
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Generated",
      text: `Your one time email verification code is ${otp}, and is valid for 2 minutes.\n\n(Generated at ${formattedDateTime})\n\n\n
      ************************************\nThis is an auto-generated email. Do not reply to this email.`,
    }

    transporter.sendMail(mailOptions, async (err, result) => {
      console.log(err)
      if (err) {
        res.status(500).send({
          message: "Enter the correct email id",
          status: "false",
          data: [err],
        })
      } else {
        res.status(200).send({
          message: "otp sent successsfully",
          status: "true",
          data: [],
        })
        const emailExists = await Otp.findOne({ email: email })
        if (emailExists) {
          const result = await Otp.updateOne(
            { email: email },
            { $set: { otp: otp, status: false } }
          )
        } else {
          const otpdata = new Otp({
            email: email,
            otp: otp,
            status: false,
          }).save()
        }
      }
    })
  } else {
    //Phone OTP
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: "sms" })
      .then(verification => {
        res.status(200).send({
          message: "Otp sent successfully to ur phone number",
          status: "true",
          data: [],
        })
      })
      .then(() => {
        const readline = require("readline").createInterface({
          input: process.stdin,
          output: process.stdout,
        })
      })
  }
})

router.post("/emailphoneverify2", async (req, res) => {
  const otp = req.body.otp
  const phone = req.body.phone
  // const email = req.body.email
  const userData = await User.findOne({
    $or: [
      { email: req.body.email!=null && req.body.email!=undefined && req.body.email!="" ? req.body.email : null },
      { cropid: req.body.cropid!=null && req.body.cropid!=undefined && req.body.cropid!=""  ? parseInt(req.body.cropid) : null },
      { mobileNumber: req.body.phone!=null && req.body.phone!=undefined && req.body.phone!= "" ? req.body.phone : null },
    ],
  },{email:1})

  const email =  userData.email ? userData.email : ""

  if (email === "") {
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code: otp })
      .then(verification =>
        res.status(200).send({
          message: "Otp verified successfully",
          status: "true",
          data: [],
        })
      )
      .catch(() =>
        res.status(500).send({ message: "Enter the correct otp", status: "false", data: [] })
      )
  } else {
    const userData = await Otp.findOne({ email: email })
    //if the email id is not present send the error message
    if (userData.otp == otp) {
      const result = await Otp.updateOne(
        { email: email },
        { $set: { status: true } }
      )

      return res
        .status(200)
        .send({ message: "valid otp", status: "true", data: [] })
    } else {
      return res
        .status(409)
        .send({ message: "Invalid otp", status: "false", data: [] })
    }
  }
})

router.post("/emailphoneverify", async (req, res) => {
  const otp = req.body.otp
  const phone = req.body.phone
  const email = req.body.email

  if (email === "") {
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code: otp })
      .then(verification =>
        res.status(200).send({
          message: "Otp verified successfully",
          status: "true",
          data: [],
        })
      )
      .catch(() =>
        res.status(500).send({ message: "Enter the correct otp", status: "false", data: [] })
      )
  } else {
    const userData = await Otp.findOne({ email: email })
    //if the email id is not present send the error message
    if (userData.otp == otp) {
      const result = await Otp.updateOne(
        { email: email },
        { $set: { status: true } }
      )

      return res
        .status(200)
        .send({ message: "valid otp", status: "true", data: [] })
    } else {
      return res
        .status(409)
        .send({ message: "Invalid otp", status: "false", data: [] })
    }
  }
})

// router.post("/emailphoneverify", async (req, res) => {
//   const otp = req.body.otp
//   const phone = req.body.phone
//   const email = req.body.email

//   if (email === "") {
//     client.verify.v2
//       .services(verifySid)
//       .verificationChecks.create({ to: phone, code: otp })
//       .then(verification =>
//         res.status(200).send({
//           message: "Otp verified successfully",
//           status: "true",
//           data: [],
//         })
//       )
//       .catch(() =>
//         res.status(500).send({ message: "Enter the correct otp", status: "false", data: [] })
//       )
//   } else {
//     const userData = await Otp.findOne({ email: email })
//     //if the email id is not present send the error message
//     if (userData.otp == otp) {
//       const result = await Otp.updateOne(
//         { email: email },
//         { $set: { status: true } }
//       )

//       return res
//         .status(200)
//         .send({ message: "valid otp", status: "true", data: [] })
//     } else {
//       return res
//         .status(409)
//         .send({ message: "Invalid otp", status: "false", data: [] })
//     }
//   }
// })

router.put("/changepassword", async (req, res) => {
  try {
    const newpin = await bcrypt.hash(req.body.newpin.toString(), 10);
    const token = req.headers.authorization;
    const token_data = await Token.findOne({ token });
    const user = await User.findOne({ _id: token_data.user });

    if (!user) {
      return res.status(500).send({
        message: "User not found",
        status: "false",
        data: [],
      });
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      req.body.oldpin.toString(),
      user.password
    );

    if (!isOldPasswordCorrect) {
      return res.status(500).send({
        message: "Enter the correct old password",
        status: "false",
        data: [],
      });
    }

    if (req.body.oldpin === req.body.newpin) {
      return res.status(500).send({
        message: "Both new and old password are the same",
        status: "false",
        data: [],
      });
    }

    const updatedata = await User.updateOne(
      { _id: token_data.user },
      { $set: { password: newpin } }
    );

    if (updatedata) {
      let notification = await adminCustomerAccountNotification.find();
      notification = notification[0]._doc
      await new AccountNotificationCustomer({user_id: token_data.user, message: notification.pin_change}).save();
      res
        .status(200)
        .send({ message: "Pin changed successfully", status: "true" })
    } else {
      res
        .status(500)
        .send({ message: "Pin not changed successfully", status: "false" })
    }


  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "An error occurred",
      status: "false",
    });
  }
});

router.put("/resetpassword", async (req, res) => {
  const newpin = await bcrypt.hash(req.body.newpin.toString(), 10)
  const email = req.body.email;
  const user = await User.findOne({ email: email })
  if(user == null){
    const updatedata = await User.updateOne(
      { _id: user._id },
      { $set: { password: newpin } }
    )
  
    if (updatedata) {
      let notification = await adminCustomerAccountNotification.find();
      notification = notification[0]._doc
      await new AccountNotificationCustomer({user_id: user._id, message: notification.pin_change}).save();
      res
        .status(200)
        .send({ message: "Pin changed successfully", status: "true" })
    } else {
      res
        .status(500)
        .send({ message: "Pin not changed successfully", status: "false" })
    }
  }else{
    res
    .status(500)
    .send({ message: "Invalid Email ID", status: "false" })
  }
})

router.post("/signup", async (req, res) => {
  try {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString()

    // checking whether the given mail id is exist in database r not
    const phoneExist = await User.findOne({
      mobileNumber: req.body.mobileNumber,
    })
    const emailExist = await User.findOne({ email: req.body.email })
    // const businessMobile = await business.findOne({mobile:req.body.mobileNumber});
    const businessEmail = await business.findOne({ email: req.body.email })
    if (phoneExist)
      return res
        .status(409)
        .send({ message: "User with given phone number already exist" })
    if (emailExist)
      return res
        .status(409)
        .send({ message: "User with given email already exist" })
    // if(businessMobile)
    // return res.status(409).send({message:"User with given phone number already exist in business"})
    if (businessEmail)
      return res
        .status(409)
        .send({ message: "User with given email already exist in business" })
    //hashing the password
    const hashedPassword = await bcrypt.hash(req.body.password.toString(), 10)

    var promoexist = req.body.promocode
    if (promoexist) {
      const userData = await User.findOne({
        refercode: req.body.promocode,
      })

      if (userData) {
        var promopoints = userData.croppoints + 30

        const result = await User.updateOne(
          { refercode: req.body.promocode },
          { $set: { croppoints: promopoints } }
        )
      }
    }
    //generate unique referid
    const referid = shortid.generate()
    //generate unique crop id
    var crop = await User.findOne().sort({ cropid: -1 }).limit(1)
    var prop = await User.findOne().sort({ propid: -1 }).limit(1)
    var result = crop.cropid
    var cropnumber = result + 1

    var results = prop.propid
    var propnumber = results + 1

    const user = await new User({
      name: req.body.name,
      cropid: cropnumber,
      propid: propnumber,
      password: hashedPassword,
      mobileNumber:
        req.body.mobileNumber != undefined ? req.body.mobileNumber : "",
      email: req.body.email != undefined ? req.body.email : "",
      UserTitle: req.body.UserTitle,
      terms: req.body.terms,
      notification: req.body.notification,
      promocode: req.body.promocode,
      refercode: referid,
      signUpDate: formattedDate,
      // auditTrail: {
      //   value: "Register Profile",
      //   status: true,
      //   message: `${req.body.name} have successfully registered your profile on ${formattedDate}`,
      // },
    }).save()
    if (user) {
      createCustomerAudit(user._id, "profile successfully registered")
    }
    var method = 0
    var userToken
    //   let now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    let oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000).toLocaleString(
      "en-US",
      { timeZone: "Asia/Kolkata" }
    )
    let userData = await User.findOne({ email: req.body.email })
    if (req.body.login_method === 1) {
      method = 1
      userToken = jwt.sign({ email: req.body.email }, "CROP@12345", {
        expiresIn: "1h",
      })
      await new Token({
        user: userData._id,
        token: userToken,
        type: method,
        expiration: oneHourFromNow,
      }).save()
    } else {
      method = 2
      userToken = jwt.sign({ email: req.body.email }, "CROP@12345")
      await new Token({
        user: userData._id,
        token: userToken,
        type: method,
      }).save()
    }
    if(req.body.email!= "" && req.body.email!= undefined){
      const date = new Date();

      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      const formattedDateTime = date.toLocaleString('en-US', options);

      console.log(formattedDateTime);

      const transporter = nodemailer.createTransport({
        // service: "Gmail",
        host: process.env.HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "CROP Registration Succesfull",
        text: `Welcome to CROP. Your account has been registered successfully\n\nEmail: ${req.body.email}\nPassword: ${req.body.password}\n\n
        (Generated at ${formattedDateTime})\n\n\n************************************\nThis is an auto-generated email. Do not reply to this email.`,
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
        }
      })
    }
    
    let notification = await adminCustomerAccountNotification.find();
    notification = notification[0]._doc
    await new AccountNotificationCustomer({user_id: userData._id, message: notification.first_time_notification}).save();
    //saving data in the database
    res.send({
      message: "Register successfully",
      token: userToken,
      type: method,
      userdata: userData,
      status: "true",
      data: {
        refercode: referid,
        cropid: cropnumber,
        croppoints: 0,
        propid: propnumber,
      },
    })
  } catch (err) {
    //if any internal error occurs it will show error message
    res
      .status(500)
      .send({ message: "Register error", status: "false", data: [err] })
  }
})

router.post("/promocode", async (req, res) => {
  var promo = req.body.promo
  if (promo === "") {
    res.status(200).send({ message: "promocode available", status: "true" })
  } else {
    const userData = await User.findOne({ refercode: promo })
    if (userData) {
      res.status(200).send({ message: "promocode available", status: "true" })
    } else {
      res
        .status(500)
        .send({ message: "promocode not available", status: "false" })
    }
  }
})

router.put("/logout", async (req, res) => {
  try {
    let token = req.headers.authorization
    const token_data = await Token.findOne({ token: token })
    const oldpassword = await Token.deleteMany({ user: token_data.user })
    const result = await User.updateOne(
      { _id: token_data.user },
      { $set: { token: "null" } }
    )
    res.status(200).send({
      status: "true",
      message: "Logout successfully",
    })
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal Server error", status: "false", data: [] })
  }
})

router.get("/tokenCheck", async (req, res) => {
  try {
    let token = req.headers.authorization
    const result = await Token.findOne({ token: token })
    if (result) {
      res.status(200).send({
        status: "true",
        message: "Token active",
      })
    } else {
      res.status(500).send({
        status: "false",
        message: "Token Inactive",
      })
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal Server error", status: "false", data: [] })
  }
})

router.get("/details", async (req, res) => {
  try {
    let token = req.headers.authorization
    const token_data = await Token.findOne({ token: token })
    const userData = await User.findOne({ _id: token_data.user })
    res.status(200).send({
      data: userData,
      status: "true",
    })
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal Server error", status: "false", data: [] })
  }
})

router.post("/login", async (req, res) => {
  try {
    // let cropid=req.body.cropid;
    // let phone=req.body.phone;
    let email = req.body.email
    console.log(email, "email")
    //getting email from the database and compare with the given email id

    const userData = await User.findOne({
      $or: [
        { email: req.body.email },
        { cropid: req.body.cropid },
        { mobileNumber: req.body.phone },
      ],
    })
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 24);
    const attempt = await loginAttemp.find({user: userData._id, createdAt: { $gte: cutoffDate }});
    if(attempt.length==3){
      return res.status(200).json({message: `Your account has been temporary blocked. Please try after 24hrs.`,status:false});
    }
    else{
      //if the email id is not present send the error message
      if (!userData) {
        return res
          .status(409)
          .send({ message: "Wrong credentialssss!", status: false })
      }
      //comparing the password with database password
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        userData.password
      )

      if (!isPasswordValid) {
        if(attempt.length==0 || attempt.length==1 || attempt.length==2 || attempt.length==3){
          await new loginAttemp({user: userData._id}).save()
          const attemptNew = await loginAttemp.find({user: userData._id, createdAt: { $gte: cutoffDate }});
          if(attemptNew.length<=3){
            return res.status(409).json({message: `You have only ${3 - attemptNew.length} attempts left.`})
          }
        }
        return res
          .status(409)
          .send({ message: "given password not exist", status: false })
      }
      // if(userData.token!=="null")
      // {
      //     return res.status(500).send({message:"You already logged in"})
      // }
      //jwt joken is created when the email and password r correct so that it will generate the token for that user(email)
      var method = 0
      var userToken
      //   let now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      let oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000).toLocaleString(
        "en-US",
        { timeZone: "Asia/Kolkata" }
      )
      if (req.body.login_method === 1) {
        method = 1
        userToken = jwt.sign({ email: userData.email }, "CROP@12345", {
          expiresIn: "1h",
        })
        await new Token({
          user: userData._id,
          token: userToken,
          type: method,
          expiration: oneHourFromNow,
        }).save()

        await loginAttemp.deleteMany({
          user:userData._id
        })

      } else {
        method = 2
        userToken = jwt.sign({ email: userData.email }, "CROP@12345")
        await new Token({
          user: userData._id,
          token: userToken,
          type: method,
        }).save()

        await loginAttemp.deleteMany({
          user:userData._id
        })

      }
      
      res.status(200).send({
        token: userToken,
        message: "Login successfull",
        status: true,
        data: { userData },
      })
    }
  } catch (err) {
    res.status(500).send({ message: "Login error", status: false, data: [err] })
  }
})

router.put("/forget", async (req, res) => {
  // const userData = await User.findOne({
  //   $or: [
  //     { email: req.body.email },
  //     { cropid: req.body.cropid },
  //     { mobileNumber: req.body.phone },
  //   ],
  // })

  try {
    const userData = await User.findOne({
      $or: [
        { email: req.body.email!=null && req.body.email!=undefined && req.body.email!="" ? req.body.email : null },
        { cropid: req.body.cropid!=null && req.body.cropid!=undefined && req.body.cropid!=""  ? parseInt(req.body.cropid) : null },
        { mobileNumber: req.body.phone!=null && req.body.phone!=undefined && req.body.phone!= "" ? req.body.phone : null },
      ],
    })
    const forgotpassword = await User.findOne({ email: userData.email })

    if (!forgotpassword) {
      return res.status(409).send({ message: "Registered email not exist" })
    }
    //updating the password in the database
    var userEmail = userData.email
    var otp = Math.floor(100000 + Math.random() * 900000)
    const result = await Otp.updateOne(
      { email: userEmail },
      { $set: { otp: otp } }
    )
    const date = new Date();

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    const formattedDateTime = date.toLocaleString('en-US', options);
    const transporter = nodemailer.createTransport({
      // service: "Gmail",
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "OTP Generated",
      text: `Your one time email verification code is ${otp}, and is valid for 2 minutes.\n\n(Generated at ${formattedDateTime})\n\n\n
      ************************************\nThis is an auto-generated email. Do not reply to this email.`,
    }
    transporter.sendMail(mailOptions, (err, result) => {
      if (err) {
        res.json("Oops error occurred")
        res.status(500).send({
          message: "OTP not sent successfully",
          status: "false",
          data: [err],
        })
      } else {
        res.status(200).send({
          message: "we have successfully sent the OTP",
          status: "true",
          data: [],
        })
      }
    })
  } catch (err) {
    res.status(500).send({ message: "Enter the registered mail-id", data: err , status:false })
  }
})

// router.put("/forgetpassword", async (req, res) => {
//   let email = req.body.email
//   const userData = await User.findOne({
//     $or: [
//       { email: req.body.email!=null && req.body.email!=undefined && req.body.email!="" ? req.body.email : null },
//       { cropid: req.body.cropid!=null && req.body.cropid!=undefined && req.body.cropid!=""  ? parseInt(req.body.cropid) : null },
//       { mobileNumber: req.body.phone!=null && req.body.phone!=undefined && req.body.phone!= "" ? req.body.phone : null },
//     ],
//   })
//   try {
//     //updating the password in the database
//     if (
//       req.body.email != "" &&
//       req.body.password != "" &&
//       req.body.email != null &&
//       req.body.password != null &&
//       req.body.email != undefined &&
//       req.body.password != undefined
//     ) {
//       const hashedPassword = await bcrypt.hash(req.body.password, 10)
//       const emailFind = await User.findOne({ email: email })
//       if (emailFind) {
//         const result = await User.updateOne(
//           { email: email },
//           { $set: { password: hashedPassword } }
//         )
//         if (result) {
//           createCustomerAudit(result._id, "Password changed Successfully")
//         }
//         res.status(200).send({
//           message: "Password changed Successfully",
//           status: "true",
//           data: [],
//         })
//       } else {
//         res
//           .status(500)
//           .send({ message: "No email found", status: "false", data: [] })
//       }
//     } else {
//       res.status(500).send({
//         message: "Email and Password should not be empty",
//         status: "false",
//         data: [],
//       })
//     }
//   } catch (err) {
//     console.log(err)
//     res
//       .status(500)
//       .send({ message: "Error Message", status: "false", data: err })
//   }
// })
router.put("/forgetpassword", async (req, res) => {
  let email = req.body.email
  try {
    //updating the password in the database
    if (
      req.body.cropid!=null &&
      req.body.cropid!=undefined &&
      req.body.phone!=null &&
      req.body.phone!=undefined &&
      req.body.password != "" &&
      req.body.email != null &&
      req.body.password != null &&
      req.body.email != undefined &&
      req.body.password != undefined
    ) {
      const userData = await User.findOne({
        $or: [
          { email: req.body.email!=null && req.body.email!=undefined && req.body.email!="" ? req.body.email : null },
          { cropid: req.body.cropid!=null && req.body.cropid!=undefined && req.body.cropid!=""  ? parseInt(req.body.cropid) : null },
          { mobileNumber: req.body.phone!=null && req.body.phone!=undefined && req.body.phone!= "" ? req.body.phone : null },
        ],
      })
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const emailFind = await User.findOne({ email: userData.email })
      if (emailFind) {
        const result = await User.updateOne(
          { email: userData.email },
          { $set: { password: hashedPassword } }
        )
        if (result) {
          createCustomerAudit(result._id, "Password changed Successfully")
        }
        res.status(200).send({
          message: "Password changed Successfully",
          status: "true",
          data: [],
        })
      } else {
        res
          .status(500)
          .send({ message: "No email found", status: "false", data: [] })
      }
    } else {
      res.status(500).send({
        message: "Email and Password should not be empty",
        status: "false",
        data: [],
      })
    }
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .send({ message: "Error Message", status: "false", data: err })
  }
})

router.get("/profile", async (req, res) => {
  try {
    let token = req.headers.authorization
    var base64
    const token_data = await Token.findOne({ token: token })
    const profile = await User.findOne({ _id: token_data.user })

    if (profile.avatar === null) {
      base64 = null
    } else {
      const imageBuffer = fs.readFileSync(profile.avatar)
      base64 = imageBuffer.toString("base64")
    }

    var details = {
      name: profile.name,
      mobileNumber: profile.mobileNumber,
      Email: profile.email,
      refercode: profile.refercode,
      dob: profile.dob,
      gender: profile.gender,
      address: profile.address,
      agegroup: profile.agegroup,
      loyaltyList: profile.loyaltyList,
      interestList: profile.interestList,
      image: base64,
      address: profile.address,
      mktNotification: profile.mktNotification,
    }

    res.status(200).json({ profile: details, status: "true", data: [] })
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal server error", status: "false", data: err })
  }
})

router.put("/updateprofile", async (req, res) => {
  let token = req.headers.authorization
  const token_data = await Token.findOne({ token: token })
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString()
  const {emailType,mobileType} = req.body;

  try {
    const id = token_data.user
    let findEmailorPhno;
    console.log(emailType,mobileType)
    if(mobileType==false && emailType==false){
      findEmailorPhno = await User.find({$or:[{email:req.body.email},{mobileNumber:req.body.mobileNumber}]}).count();
    }
    else if(mobileType==false){
    findEmailorPhno = await User.find({mobileNumber:req.body.mobileNumber}).count();
    }
    else if(emailType==false){
      findEmailorPhno = await User.find({email:req.body.email}).count();
    }
    else{
      findEmailorPhno=0;
    }

    if(findEmailorPhno==0 || findEmailorPhno=="0"){
    const result = await User.findByIdAndUpdate({ _id: id }, req.body)
    //       const result= await User.updateOne({_id:token_data.user},{$set:{
    //          name:req.body.name,
    //          mobileNumber:req.body.mobileNumber,
    //          email:req.body.email,
    //          address:req.body.address,
    //          gender:req.body.gender,
    //          interestList:req.body.interestList,
    //          dob:req.body.dob,
    //          agegroup:req.body.agegroup,
    //          loyaltyList:req.body.loyaltyList,
    //          lastUpdatedDate:formattedDate,
    //          interestList:req.body.interestList

    //  }
    //  , $push: { auditTrail:{value: "Update Profile", status: true, message:`${req.body.name} have successfully updated his profile on ${formattedDate}`} }});
    //  const aaa= await User.updateOne({_id:token_data.user},{$set:{
    //  "address.0": {_id:mongoose.Types.ObjectId(), address:req.body.address[0]}}})

    //  const bbb = await User.updateOne({_id:token_data.user,"address._id": ObjectId("64424f6a47b817d4e2523827")},
    //  {$set:{"address.$.address": {address:req.body.address[0]}}})
      if (result) {
        createCustomerAudit(result._id, "Profile Updated successfully")
      }
      res.send({ message: "Updated successfully", status: "true", data: result })
    }
    else{
      res.send({ message: "Phno already registered try another", status: "false", data: [] })
    }
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .send({ message: "Internal Server error", status: "false", data: err })
  }
})

router.post("/community", async (req, res) => {
  try{
    let token = req.headers.authorization

    // let data=await User.findOne({"token":token})
    const token_data = await Token.findOne({ token: token })
    const updatedata = await User.updateOne(
      { _id: token_data.user },
      {
        $set: {
          mktNotification: req.body.market,
          smsNotification: req.body.sms,
          emailNotification: req.body.email,
        },
      }
    )
    if (updatedata) {
      res.status(200).send({ message: "updated successfully", status: "true" })
    } else {
      res.status(500).send({ message: "Not updated successfully", status: "false" })
    }
  }
  catch(err){
    res.status(500).send({ message: "Not updated successfully", status: "false", data: err })
  }
  })

router.get("/showcommunity", async (req, res) => {
  let token = req.headers.authorization
  const token_data = await Token.findOne({ token: token })
  const communitydata = await User.findOne({ _id: token_data.user })
  if (communitydata) {
    res.status(200).send({
      data: {
        mktNotification: communitydata.mktNotification,
        smsNotification: communitydata.smsNotification,
        emailNotification: communitydata.emailNotification,
      },
      status: "true",
    })
  } else {
    res.status(500).send({ data: "Internal server Error", status: "false" })
  }
})

router.post("/biometric", async (req, res) => {
  let token = req.headers.authorization
  const token_data = await Token.findOne({ token: token })
  const biometricdata = await User.findOne({ _id: token_data.user })

  const isPasswordValid = await bcrypt.compare(
    req.body.pin,
    biometricdata.password
  )

  if (!isPasswordValid) {
    return res.status(500).send({ message: "enter the correct pin" })
  }

  const updatebiometric = await User.updateOne(
    { _id: token_data.user },
    { $set: { biometricterms: req.body.biometric } }
  )
  if (updatebiometric) {
    createCustomerAudit(
      updatebiometric._id,
      " Biometric Data Successfully Updated"
    )
  }
  const userdata = await User.findOne({ _id: token_data.user })

  if (userdata.biometricterms === true) {
    res.status(200).send({ message: "Biometric enabled", status: "true" })
  } else {
    res.status(200).send({ message: "Biometric disabled", status: "true" })
  }
})

router.get("/biometricterms", async (req, res) => {
  let token = req.headers.authorization
  const token_data = await Token.findOne({ token: token })
  const biometricdata = await User.findOne({ _id: token_data.user })
  if (biometricdata) {
    res.status(200).send({
      data: { biometricterms: biometricdata.biometricterms },
      status: "true",
    })
  } else {
    res.status(500).send({ message: "Internal server error", status: "false" })
  }
})

router.post("/feedback", async (req, res) => {
  let token = req.headers.authorization

  let feedback = req.body.feedback

  const token_data = await Token.findOne({ token: token })

  const updatedata = await User.updateOne(
    { _id: token_data.user },
    { $set: { feedback: feedback } }
  )

  if (updatedata) {
    createCustomerAudit(updatedata._id, " Feedback updated successfully")
    res
      .status(200)
      .send({ message: "Feedback updated successfully", status: "true" })
  } else {
    res
      .status(500)
      .send({ message: "Feedback not updated successfully", status: "false" })
  }
})

router.put("/levels", async (req, res) => {
  try{
    let token = req.headers.authorization

    const points = parseInt(req.body.croppoints)

    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString()
    const token_data = await Token.findOne({ token: token })
    //Changing levels according to croppoints5
    if (points === 0) {
      const updatelevels = await User.updateOne(
        { _id: token_data.user },
        {
          $set: { UserTier: "Base" },
          $push: {
            auditTrail: {
              value: "UserTier",
              status: true,
              message: `The usertier changed to Base on ${formattedDate}`,
            },
          },
        }
      )
      res.send({ status: "true" })
    } else if (points <= 30) {
      const updatelevels = await User.updateOne(
        { _id: token_data.user },
        {
          $set: { UserTier: "Silver" },
          $push: {
            auditTrail: {
              value: "UserTier",
              status: true,
              message: `The usertier changed to Silver on ${formattedDate}`,
            },
          },
        }
      )
      res.send({ status: "true" })
    } else if (points <= 60) {
      const updatelevels = await User.updateOne(
        { _id: token_data.user },
        {
          $set: { UserTier: "Gold" },
          $push: {
            auditTrail: {
              value: "UserTier",
              status: true,
              message: `The usertier changed to Gold on ${formattedDate}`,
            },
          },
        }
      )
      res.send({ status: "true" })
    } else if (points <= 1000) {
      const updatelevels = await User.updateOne(
        { _id: token_data.user },
        {
          $set: { UserTier: "Platinum" },
          $push: {
            auditTrail: {
              value: "UserTier",
              status: true,
              message: `The usertier changed to Platinum on ${formattedDate}`,
            },
          },
        }
      )
      res.send({ status: "true" })
    }
    // else if(points<=2800)
    // {
    //     const updatelevels=await User.updateOne({_id:token_data.user}, {$set: { UserTier:"Diamond" }});
    //     res.send({status:"true"})
    else {
      const updatelevels = await User.updateOne(
        { _id: token_data.user },
        {
          $set: { UserTier: "Diamond" },
          $push: {
            auditTrail: {
              _id: new mongoose.Types.ObjectId(),
              value: "UserTier",
              status: true,
              message: `The usertier changed to Diamond on ${formattedDate}`,
            },
          },
        }
      )
      res.send({ status: "true" })
    }
    //comment one the mate website
  }
  catch(err){
    res.status(500).send({ message: "Not updated successfully", status: "false", data: err })
  }
})
//comment on the page

router.post("/newsletter", async (req, res) => {
  console.log(req.body.email)

  const userdata = await Newsletter.findOne({ email: req.body.email })

  if (userdata) {
    res
      .status(200)
      .send({ message: "The given mail-ID already exist", status: "false" })
  } else {
    const user = new Newsletter({
      email: req.body.email,
    }).save()

    res
      .status(200)
      .send({ message: "Your email is added to newsletter", status: "true" })
  }
})

router.post("/mate", async (req, res) => {
  let token = req.headers.authorization
  let email = req.body.email

  console.log("sridhar", email)

  console.log({ token })
  const token1 = await Token.findOne({ token })
  const findUser = await User.findById(token1.user)
  if (!findUser) return res.status(401).send("User Authentication Failed")
  console.log(findUser.email)
  const refercode = findUser.refercode
  const userdata = await User.findOne({ email })

  console.log("userData", userdata)
  if (userdata == null) {

  const transporter = nodemailer.createTransport({
    // service: "Gmail",
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Refer code",
    text: `REFER CODE ${refercode}`,
  }
  transporter.sendMail(mailOptions, async (err, result) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Internal server error", status: "false", data: [] })
    } else {
      let notification = await adminGeneralAccountNotification.find();
      notification = notification[0]._doc
      await new GeneralNotificationCustomer({user_id: token1.user, message: notification.get_a_mate}).save();
      return res
        .status(200)
        .send({ message: "Mail sent successfully", status: "true", data: [] })
    }
  })
}
else{
  return res
      .status(500)
      .send({ message: "The given mail-ID already exist", status: "false" })
}
})

router.get("/profileAdmin", async (req, res) => {
  try {
    // let token=req.headers.authorization
    // var base64;
    const profile = await User.find().sort({ _id: -1 })
    res.status(200).json({ profile: profile, status: "true", data: [] })
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal server error", status: "false", data: [err] })
  }
})

router.post("/getproductmissingcrop", async (req, res) => {
  try {
    const { invoice_id } = req.body
    const tracker = await customerPaymentTracker.find({
      number: invoice_id,
    })
    if (tracker.length != 0) {
      const inputDate = new Date(tracker[0].createdAt)
      const currentDate = new Date()

      const differenceInDays = (currentDate - inputDate) / (1000 * 60 * 60 * 24)

      if (differenceInDays <= 90) {
        // const product = await Product.find({
        //   _id: { $in: tracker[0].productId },
        // });
        res.status(200).json({
          data: {
            product: tracker[0].cartDetails.cartItems,
            invoice_date: tracker[0].createdAt,
            invoice_array: tracker[0],
          },
          status: 200,
        })
      } else {
        res.status(200).json({
          data: [],
          message: "The invoice date is more than 90 days ago.",
          status: 200,
        })
      }
    } else {
      res.status(200).json({
        data: [],
        message: "No invoice id found.",
        status: 200,
      })
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal server error", status: "false", data: [err] })
  }
})

router.post("/missingcrop", async (req, res) => {
  try {
    let token = req.headers.authorization
    const token_data = await Token.findOne({ token: token })
    req.body.user_id = token_data.user
    const missingCrops = await new MissingCrop(req.body).save()
    console.log(req.body)
    console.log(missingCrops._id, "mcId")
    req.body.product_id.map(misCrops => {
      const { business } = misCrops
      console.log({ business })
      createMissingCropNotification(missingCrops._id, business)
    })
    let notification = await adminCustomerRequestAndComplainedNotification.find();
    notification = notification[0]._doc
    await new ComplainNotificationCustomer({user_id: token_data.user, message: notification.missing_points_claim}).save();
    res.status(200).json({
      data: [req.body],
      status: 200,
      message: "Successfully submitted",
    })
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal server error", status: "false", data: [err] })
  }
})

router.get("/getmissingcrop", async (req, res) => {
  try {
    let token = req.headers.authorization;
    const token_data = await Token.findOne({ token: token });
    const datanew = await MissingCrop.find({ user: token_data.user });
    res.status(200).json({ data: datanew, status: 200 });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal server error", status: "false", data: [err] });
  }
});

router.get("/getcommunicationPreference", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = await Token.findOne({ token: token });
    const data = await CommunicationPreference.findOne({ user: user.user });
    if (!data) {
      return res.status(200).json({ message: "Data not found", data:[], status:200 });
    }
    res.status(200).json({ message: "Success", data: data, status:200 });
  } catch (err) {
    res.status(500).json({ message: err.message, status:500 });
  }
});

router.put("/communicationPreference", async (req, res) => {
  try {
    const {app, sms, email} = req.body;
    const token = req.headers.authorization;
    const user = await Token.findOne({ token: token });
    const data = await CommunicationPreference.findOne({ user: user.user });
    if (!data) {
      await CommunicationPreference.create({ user: user.user, app: app, sms: sms, email: email });
    }
    else{
      await CommunicationPreference.updateOne({ _id: data._id },
        { $set:{ app: app, sms: sms, email: email }});
    }
    res.status(200).json({ message: "Success", data: data, status:200 });
  } catch (err) {
    res.status(500).json({ message: err.message, status:500 });
  }
});

router.put("/feedback", async (req, res) => {
  try {
    const {rating} = req.body;
    const token = req.headers.authorization;
    const user = await Token.findOne({ token: token });
    const data = await Feedback.findOne({ user: user.user });
    if (!data) {
      await Feedback.create({ user: user.user, rating: rating });
    }
    else{
      await Feedback.updateOne({ _id: data._id },
        { $set:{ rating: rating }});
    }
    res.status(200).json({ message: "Thanks for rating us.", data: data, status:200 });
  } catch (err) {
    res.status(500).json({ data: err.message, message: "Sorry something happens.", status:500 });
  }
});


router.get('/addressByToken', async (req, res) => {
  try{
    const token = req.headers.authorization;
    const user = await Token.findOne({ token: token });
    const data = await User.findOne({ _id: user.user });
    let obj = []
    if(data.address.length != 0){
      for(let i=0; i<data.address.length; i++){
        let state = await StateSchema.findOne({id:data.address[i].state})
        let arr = {}
        arr['line1'] = data.address[i].line1,
        arr['line2'] = data.address[i].line2,
        arr['line3'] = data.address[i].line3,
        arr['state'] = state.name,
        arr['city'] = data.address[i].city,
        arr['pin'] = data.address[i].pin,
        arr['_id'] = data.address[i]._id
        obj.push(arr);
      }
      res.status(200).json({ data:obj, status:200 })
    }
    else{
      res.status(200).json({ data:obj, status:200 })
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ data:err, status:500 })
  }
})

router.put('/addressByToken', async (req, res) => {
  try{
    const token = req.headers.authorization;
    const user = await Token.findOne({ token: token });
    const aaa= await User.updateOne({_id:user.user},
      {$push:{address:req.body}
    })
    res.status(200).json({data:aaa, status:200, message: "Address added successfully."})
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ data:err, status:500 })
  }
})

router.get('/cropPoints', async (req, res) => {
  try{
    const token = req.headers.authorization;
    const user = await Token.findOne({ token: token });
    const aaa = await User.findOne({ _id:user.user });
    const bbb = await Cart.findOne({ user_id:user.user })
    const ccc = await Wishlist.findOne({ user_id:user.user })
    arr = {}
    arr['cropPoint'] = aaa.croppoints
    arr['propPoint'] = aaa.proppoints
    if(bbb != undefined && bbb != null){
      if(bbb.cart != undefined){
        arr['cartCount'] = bbb.cart.length
      }
      else{
        arr['cartCount'] = 0
      }
    }else{
      arr['cartCount'] = 0
    }
    if(ccc != undefined && ccc != null){
      if(ccc.cart != undefined){
        arr['wishlistCount'] = ccc.cart.length
      }
      else{
        arr['wishlistCount'] = 0
      }
    }
    else{
      arr['wishlistCount'] = 0
    }
    
    res.status(200).json({data:arr, status:200, message: ""})
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ data:err, status:500 })
  }
})

router.get('/notification', async (req, res) => {
  try{
    const token = req.headers.authorization;
    const user = await Token.findOne({ token: token });
    const Account = await AccountNotificationCustomer.find({ user_id:user.user });
    const General = await GeneralNotificationCustomer.find({ user_id:user.user })
    const Complain = await ComplainNotificationCustomer.find({ user_id:user.user })
    const Invoice = await InvoicePaymentNotificationCustomer.find({ user_id:user.user })

    arr = {}
    arr['AccountCount'] = Account.length
    arr['AccountMessage'] = Account
    arr['GeneralCount'] = General.length
    arr['GeneralMessage'] = General
    arr['ComplainCount'] = Complain.length
    arr['ComplainMessage'] = Complain
    arr['InvoiceCount'] = Invoice.length
    arr['InvoiceMessage'] = Invoice
    arr['totalCount'] = Account.length + General.length + Complain.length + Invoice.length
    res.status(200).json({data:arr, status:200, message: ""})
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ message:err, status:500 })
  }
})

router.delete('/notification', async (req, res) => {
  try{
    const token = req.headers.authorization;
    const type = req.query.type;
    const id = req.query.id;
    const user = await Token.findOne({ token: token });
    if(user){
      if(type == 1){
        const Account = await AccountNotificationCustomer.find({ user_id:user.user, _id: id }).deleteOne();
      }
      else if(type == 2){
        const General = await GeneralNotificationCustomer.find({ user_id:user.user, _id: id }).deleteOne();
      }
      else if(type == 3){
        const Complain = await ComplainNotificationCustomer.find({ user_id:user.user, _id: id }).deleteOne();
      }
      else if(type == 4){
        const Invoice = await InvoicePaymentNotificationCustomer.find({ user_id:user.user, _id: id }).deleteOne();
      }
      else if(type == 5){
        const Account = await AccountNotificationCustomer.find({ user_id:user.user }).deleteMany();
      }
      else if(type == 6){
        const General = await GeneralNotificationCustomer.find({ user_id:user.user }).deleteMany();
      }
      else if(type == 7){
        const Complain = await ComplainNotificationCustomer.find({ user_id:user.user }).deleteMany();
      }
      else if(type == 8){
        const Invoice = await InvoicePaymentNotificationCustomer.find({ user_id:user.user }).deleteMany();
      }
    }    
    res.status(200).json({status:200, message: "Notification deleted succesfully"})
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ message:err, status:500 })
  }
})

router.put("/newsletter", async (req, res) => {
  const token = req.headers.authorization;
  const newsletter = req.body.newsletter;
  const token_new = await Token.findOne({ token: token });
  const user = await User.updateOne({ email: token_new.user },{ $set: { newsletter: newsletter }})
  if (newsletter == true) {
    // let notification = await adminCustomerAccountNotification.find();
    // notification = notification[0]._doc
    // await new AccountNotificationCustomer({user_id: user._id, message: notification.pin_change}).save();
    res
      .status(200)
      .send({ message: "Newsletter Activated Successfully", status: "true" })
  } else {
    res
      .status(200)
      .send({ message: "Newsletter De-Activated Successfully", status: "true" })
  }
})

router.put("/locality", async (req, res) => {
  const token = req.headers.authorization;
  const locality = req.body.locality;
  const token_new = await Token.findOne({ token: token });
  const user = await User.updateOne({ email: token_new.user },{ $set: { locality: locality }})
  if (locality == true) {
    // let notification = await adminCustomerAccountNotification.find();
    // notification = notification[0]._doc
    // await new AccountNotificationCustomer({user_id: user._id, message: notification.pin_change}).save();
    res
      .status(200)
      .send({ message: "Locality Activated Successfully", status: "true" })
  } else {
    res
      .status(200)
      .send({ message: "Locality De-Activated Successfully", status: "true" })
  }
})

module.exports = router;
