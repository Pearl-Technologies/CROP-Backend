const admin = require("../../models/superAdminModel/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "CROP@12345";
const nodemailer = require("nodemailer")
const { Token } = require("../../models/User");
// const { sendEmail } = require("../../../config/email");

const createAdmin = async (req, res) => {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    if (req.body.password !== req.body.c_password) {
      return res.status(400).json({
        success: false,
        error: "password and confirm password is not matching",
      });
    }
    let user = await admin.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        success: false,
        error: "Sorry a user with this email already exits",
      });
    }

    //secure password by bcrypt
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);
    //

    //create a new user
    let User = await admin.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      user: {
        id: User._id,
      },
    };

    const userToken = jwt.sign(data, JWT_SECRET);
    await new Token({
      user: User._id,
      token: userToken,
      type: 3,
    }).save();
    success = true;
    let message = "admin user created successfully";
    res.json({ success, msg:message });
    
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Some Error Occured");
  }
};
const adminLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.errors[0].msg });
  }
  const { email, password } = req.body;
  try {
    //finding users with email id
    let adminUser = await admin.findOne({ email });

    if (!adminUser) {
      success = false;
      return res.status(400).json({ msg: "Please try to login with correct credentials" });
    }
    //compare password by bcrypt
    const passwordCompare = await bcrypt.compare(password, adminUser.password);
    if (!passwordCompare) {
      console.log("fail");
      return res.status(400).json({
        msg: "Please try to login with correct credentials",
      });
    }

    const data = {
      user: {
        id: adminUser.id,
      },
    };

    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    const accessToken = authtoken;
    const user = email;
    const auth = { accessToken, user, profileImage: adminUser.filename, name: adminUser.name};
    res.send(auth);
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).json({ msg: "Internal Sever Error Occured" });
  }
};
const adminPasswordReset = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ msg: errors });
  }
  const { email, password, c_password } = req.body;
  try {
    //finding users with email id
    if (password !== c_password) {
      return res.status(401).json({ msg: "confirmation password is not matching" });
    }
    let adminUser = await admin.findOne({ email });
    if (!adminUser) {
      return res.status(400).send({ msg: "user not found" });
    }
    //secure password by bcrypt
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(password, salt);
    adminUser = await admin.updateOne({ email: email }, { $set: { password: secPass } });
    res.status(200).json({ msg: "password successfully changed" });
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).json({ msg: "Internal Sever Error Occured" });
  }
};

const getAllAdmin = async (req, res) => {
  let success = false;
  try {
    //finding users with email id
    let user = await admin.find().select("-password");
    success = true;
    res.json({ success, user });
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Sever Error Occured");
  }
};
const getAdminData = async (req, res) => {
  try {
    //finding users with email id
    let id = req.user.user.id;
    let user = await admin.findOne({ _id: id }, { name: 1, email: 1, phone: 1, gender: 1, birthDate: 1, filename: 1 });
    res.status(200).json({ user });
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Sever Error Occured");
  }
};

const sendMail = (req, res) => {
  const mailData = {
    from: process.env.EMAIL_USER,
    to: `${"pradeepswain2165@gmail.com"}`,
    subject: "Email Activation",
    subject: "Verify Your Email",
    html: `<h2>Hello ${"pradeep"}</h2>
        <p>Verify your email address to complete the signup and login into your <strong>CROP</strong> account.</p>
    
          <p>This link will expire in <strong> 15 minute</strong>.</p>
    
          <p style="margin-bottom:20px;">Click this link for active your account</p>
    
          <a href="${process.env.STORE_URL}/email-verify" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none; cursor:"pointer">Verify Account</a>
    
          <p style="margin-bottom:0px;">Thank you</p>
          <strong>Hamart Team</strong>
           `,
  };
  const message = "Notification sent";
  sendEmail(mailData, res, message);
};
const sendMassNotification = (req, res) => {
  const { emailData, subject, notificationBody, user } = req.body;
  for (let i = 0; i < emailData.length; i++) {
    console.log(emailData[i]);
    const mailData = {
      from: process.env.EMAIL_USER,
      to: `${emailData[i]}`,
      subject: subject,
      // html: `<h2>Hello ${emailData[i].slice(0, emailData[i].indexOf("@"))}</h2>
      html: `<h2>Hello ${user}</h2> 
         `,
    };
    const message = "message sent successfully!";
    sendEmail(mailData, res, message);
  }
};

const passwordResetEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ msg: errors });
  }
  const { email } = req.body;
  try {
    let findRecord = await admin.findOne({ email });
    if (!findRecord) {
      return res.status(204).json({ msg: "Account Not Found Please Contact To SuperAdmin to Create One" });
    }
    const data = {
      user: {
        id: findRecord._id,
      },
    };

    const authtoken = jwt.sign(data, JWT_SECRET);
    const subject = "CROP notification";
    const mailData = {
      from: process.env.EMAIL_USER,
      to: `${email}`,
      subject: `${subject}`,
      html: `<h1>Hello</h1>
        <p>	We received a request to reset the password for the CROP admin account associated with ${email}.</p>
     
          <a href="${process.env.STORE_URL}/pages/passwordReset?email=${email}&passkey=${authtoken}" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none; cursor:"pointer">Reset your password</a>
    
          <p style="margin-bottom:0px;">	If you didn’t request to reset your password, contact us via our support site. No changes were made to your account yet.</p>
          <p>Having trouble signing in? Get help at CROP Support.</p>
          <strong>-The Stripe team</strong>
           `,
    };
    let msg = `<h1>Hello</h1>
    <p>	We received a request to reset the password for the CROP admin account associated with ${email}.</p>
 
      <a href="${process.env.STORE_URL}/pages/passwordReset?email=${email}&passkey=${authtoken}" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none; cursor:"pointer">Reset your password</a>

      <p style="margin-bottom:0px;">	If you didn’t request to reset your password, contact us via our support site. No changes were made to your account yet.</p>
      <p>Having trouble signing in? Get help at CROP Support.</p>
      <strong>-The Stripe team</strong>
       `
    const message = "message sent successfully!";
    // sendEmail(mailData, res, message);
     sendEmail(email, subject, msg, message, res);
    // }
    // return res.status(200).json({ msg: message });
  } catch (error) {
    console.log(error);
    // return res.status(500).json({ msg: "Server error found" });
  }
};
const sendEmail = (toEmail, subject, msg, resMsg, res) => {
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
      // console.log("one")
      // const otpData = new Otp({
      //     email: toEmail,
      //     otp: otp,
      //     otpType: otpType,
      //     userType: userType,
      // })
      // console.log("two")
      // await otpData.save();
      // console.log({otpData})
      return res.status(200).send({ msg: resMsg, status: "true" })
  }
})
}

module.exports = {
  passwordResetEmail,
  createAdmin,
  adminLogin,
  getAllAdmin,
  adminPasswordReset,
  getAdminData,
};
