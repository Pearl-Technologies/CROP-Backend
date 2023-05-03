const admin = require("../../models/superAdminModel/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "CROP@12345";
const { sendEmail } = require("../../config/email");
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

    //create a new user
    user = await admin.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    success = true;
    let message = "admin user created successfully";
    res.json({ success, message });
    // res.json(user);
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
    return res.status(400).json({msg: errors.errors[0].msg});
  }
  const { email, password } = req.body;
  try {
    //finding users with email id
    let adminUser = await admin.findOne({ email });

    if (!adminUser) {
      success = false;
      return res
        .status(400)
        .json({ "msg": "Please try to login with correct credentials" });
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
    const auth = { accessToken, user };
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
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(401).json({ msg: errors });
  }

  const { email, password, c_password } = req.body;
  try {
    //finding users with email id
    if (password !== c_password) {
      return res
        .status(401)
        .json({ msg: "confirmation password is not matching" });
    }
    let adminUser = await admin.findOne({ email });
    if (!adminUser) {
      success = false;
      return res.status(204).json({ msg: "user not found" });
      let errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.status(401).send(errors);
      }

      const { email, password } = req.body;
      try {
        //finding users with email id
        let adminUser = await admin.findOne({ email });
        if (!adminUser) {
          errors = [{ msg: "Please try to login with correct credentials" }];
          return res.status(404).json({ errors });
        }
        //compare password by bcrypt
        const passwordCompare = await bcrypt.compare(
          password,
          adminUser.password
        );
        if (!passwordCompare) {
          errors = [{ msg: "Please try to login with correct credentials" }];
          return res.status(401).json({ errors });
        }
        const data = {
          user: {
            id: adminUser.id,
          },
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        const accessToken = authtoken;
        const user = email;
        const auth = { accessToken, user };
        res.status(200).send(auth);
      } catch (error) {
        //for log in console
        console.error(error.message);
        //for log in response
        res.status(500).send("Internal Sever Error Occured");
      }
    }
    const adminPasswordReset = async (req, res) => {
      const errors = validationResult(req);
      let success = false;
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password, c_password } = req.body;
      try {
        //finding users with email id
        if (password !== c_password) {
          return res
            .status(400)
            .json({ error: "confirmation password is not matching" });
        }
        let adminUser = await admin.findOne({ email });
        if (!adminUser) {
          success = false;
          return res.status(400).json({ error: "user not found" });
        }
        //secure password by bcrypt
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);
        adminUser = await admin.updateOne(
          { email: email },
          { $set: { password: secPass } }
        );
        const data = {
          user: {
            id: adminUser.id,
          },
        };

        res.status(200).json({ msg: "password successfully changed" });
        // res.json(user);
      } catch (error) {
        //for log in console
        console.error(error.message);
        //for log in response
        res.status(500).json({ msg: "Internal Sever Error Occured" });
      }
    };
    const passwordRest_email = async (req, res) => {
      const { email } = req.body;
      console.log(req.body);
      try {
        let findRecord = await admin.findOne({ email });
        if (!findRecord) {
          return res.status(204).json({ msg: "not found" });
        }
        return res.status(200).json({ msg: "continue" });
      } catch (error) {
        return res.status(500).json({ msg: "Server error found" });
      }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    // const accessToken=authtoken;
    // const user = email;
    const auth = { message: "password reset success" };
    res.send(auth);
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Sever Error Occured");
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
    let user = await admin.find(
      {},
      { name: 1, email: 1, phone: 1, gender: 1, birthDate: 1, filename:1 }
    );
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
    
          <a href="${
            process.env.STORE_URL
          }/email-verify" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none; cursor:"pointer">Verify Account</a>
    
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


const passwordRest_email = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);

  // emailData, subject, notificationBody, user="pradeep"
  try {
    let findRecord = await admin.findOne({ email });
    if (!findRecord) {
      return res.status(204).json({ msg: "not found" });
    }

    // for (let i = 0; i < emailData.length; i++) {
      // console.log(emailData[i]);
      const mailData = {
        from: process.env.EMAIL_USER,
        to: `pradeepkumar@pearlcons.com`,
        subject: "password_reset",
        // html: `<h2>Hello ${emailData[i].slice(0, emailData[i].indexOf("@"))}</h2>  
        html: `<h2>Hello ${"pradeep"}</h2>
        <p>Verify your email address to complete the signup and login into your <strong>CROP</strong> account.</p>
    
          <p>This link will expire in <strong> 15 minute</strong>.</p>
    
          <p style="margin-bottom:20px;">Click this link for active your account</p>
    
          <a href="${
            process.env.STORE_URL
          }/pages/passwordReset?email=pradeep@gmail.com" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none; cursor:"pointer">Verify Account</a>
    
          <p style="margin-bottom:0px;">Thank you</p>
          <strong>Hamart Team</strong>
           `,
      };
      const message = "message sent successfully!";
      sendEmail(mailData, res, message);
    // }
    // return res.status(200).json({ msg: "continue" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error found" });
  }
};

module.exports = {
  passwordRest_email,
  createAdmin,
  adminLogin,
  getAllAdmin,
  adminPasswordReset,
  getAdminData,
};
