const business = require('../../models/businessModel/business');
const businessCrop = require('../../models/businessModel/businessCrop');
const businessProp = require('../../models/businessModel/businessProp');
const businessNotification = require('../../models/businessModel/businessNotification');
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { Otp } = require('../../models/User');
const JWT_SECRET = 'crop@12345'

const registrationOTP = async (req, res) => {
  const { mobile, email } = req.body;
  const phone = mobile;
  try {
    if (!phone && !email) {
      return res.status(409).send({ message: "Email or Phone Number Required", status: false })
    }
    console.log(phone, email)

    var bool1 = 0;
    var bool2 = 0;

    if (email === "") {
      bool1 = 1;
    }
    if (phone === "") {
      bool2 = 1;
    }
    if (bool2 === 0) {
      const phoneExist = await business.findOne({ mobileNumber: phone });
      if (phoneExist)
        return res.status(409).send({ message: "User with given phone number already exist", status: false })
    }
    if (bool1 === 0) {
      const emailExist = await Otp.findOne({ email: email });
      if (emailExist)
        return res.status(409).send({ message: "User with given email already exist", status: false })
    }

    if (email) {
      //Email OTP
      var otp = Math.floor(100000 + Math.random() * 900000)

      const transporter = nodemailer.createTransport({
        // service: "Gmail",
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });

      const mailOptions =
      {
        from: "vickystater1@gmail.com",
        to: email,
        subject: "resetted password",
        text: `OTP GENERATED ${otp}`
      }

      transporter.sendMail(mailOptions, (err, result) => {
        if (err) {
          console.log(err)
          res.status(500).send({ message: "Enter the correct email id", status: "false", data: [] });
        } else {
          res.status(200).send({ message: "otp sent successsfully", status: "true", data: [] });
          const otpdata = new Otp({
            email: email,
            otp: otp
          }).save();
          console.log(otpdata)
        }
      })
    }
    else {
      //Phone OTP
      console.log(phone, "phone")
      client.verify.v2
        .services(verifySid)
        .verifications.create({ to: phone, channel: "sms" })
        .then((verification) => {
          console.log(verification);
          res.status(200).send({ message: 'Otp sent successfully to ur phone number', status: "true", data: [] })
        })
        .then(() => {
          const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
          })
        })
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
  }
}

const verifyBusiness = async (req, res) => {

  const otp = req.body.otp;
  const phone = req.body.phone;
  const email = req.body.email;
  console.log(phone, otp, email);
  if (email === "") {
    console.log(phone, otp)
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code: otp })
      .then((verification) => res.status(200).send({ message: 'Otp verified successfully', status: "true", data: [] }))
      .catch(() => res.status(500).send({ message: 'Enter the correct otp', status: "false", data: [] }))
      .then(() => readline.close());
  }
  else {
    const userData = await Otp.findOne({ email: email });
    console.log(userData.otp, otp)
    //if the email id is not present send the error message
    if (userData.otp == otp) {
      return res.status(200).send({ message: "valid otp", status: "true", data: [] })
    }
    else {
      return res.status(409).send({ message: "Invalid otp", status: "false", data: [] })
    }
  }
}

const resendOtp = async(req,res) =>{  
  const email=req.body.email;
  var otp=Math.floor(100000 + Math.random() * 900000)

  const transporter = nodemailer.createTransport({
      // service: "Gmail",
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
      }
  });
  
  const mailOptions =
   {
      from:"vickystater1@gmail.com",
      to: email,
      subject: "resetted password",
      text:`OTP GENERATED ${otp}`
  }
  
  transporter.sendMail(mailOptions, async(err, result) => {
      if (err){
          console.log(err)
          res.status(500).send({message:"Enter the correct email id",status:"false",data:[]});   
      } else{
          res.status(200).send({message:"otp sent successsfully",status:"true",data:[]});       
          const result= await  Otp.updateOne({email:email }, {$set: {otp : otp}});          
      }
      })
}

const createBusinessUser = (async (req, res) => {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    console.log(req.body);
    const { email, mobileNumber, fName, lname, terms, title, businessId, promocode, notification, refferalCode, cropId, propId, } = req.body;
    let user = await business.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: "Sorry a user with this email already exits" });
    }
    // email: 'pradeep@gmail.com',
    // mobileNumber: '1234567890',
    // password: 123456,
    // businessId: '79879hhoh',
    // businessName: 'retails',
    // fName: 'pradeep',
    // lname: 'swain',
    // terms: true

    //secure password by bcrypt
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);

    //create a new user
    user = await business.create({
      ownerName: { title, fName, lname },
      email,
      password: secPass,
      terms,
      mobileNumber,
      businessId: businessId,
      promocode,
      notification,
      cropId,
      propId,
      refferalCode

    });
    const data = {
      user: {
        id: user.id,
      },
    };
    await businessNotification.create({
      type: "account",
      desc: "account created successfully",
      cropId: user.cropId,
    });
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Some Error Occured");
  }
})
const BusinessLogin = (async (req, res) => {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    //finding users with email id
    let user = await business.findOne({ email });

    if (!user) {
      success = false;
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }
    //compare password by bcrypt
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };
    await businessNotification.create({
      type: "account",
      desc: "account login successfully",
      cropId: user.cropId,
    });
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Sever Error Occured");
  }
})
const getAllBusiness = (async (req, res) => {


  try {
    //finding users with email id
    let user = await business.find();

    if (!user) {
      success = false;
      return res.status(400).json({ error: "no record found" });
    }

    success = true;
    res.json({ success, user });
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Sever Error Occured");
  }
})

const getAllBusinessCrop = (async (req, res) => {
  try {
    //finding users with email id
    let user = await businessCrop.find();

    if (!user) {
      success = false;
      return res.status(400).json({ error: "no data found" });
    }

    success = true;
    res.json({ success, user });
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Sever Error Occured");
  }
})
const getAllBusinessProp = (async (req, res) => {
  try {
    //finding users with email id
    let user = await businessProp.find();

    if (!user) {
      success = false;
      return res.status(400).json({ error: "no data found" });
    }

    success = true;
    res.json({ success, user });
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Sever Error Occured");
  }
})
//saving crop
const saveBusinessCrop = (async (req, res) => {
  const { type, description, cropId, credit, debit } = req.body;
  try {
    //finding users with email id
    let user = await businessCrop.find();
    if (type === 'credit') {
      await businessCrop.create({
        credit,
        description,
        cropId
      })
      success = true;
      let message = "saved"
      res.json({ success, message });
    } else if (type === 'debit') {
      await businessCrop.create({
        debit,
        description,
        cropId
      })
      success = true;
      let message = "saved"
      res.json({ success, message });
    } else {
      success = false;
      let message = "not saved"
      res.json({ success, message });
    }
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Sever Error Occured");
  }
})
const saveBusinessProp = (async (req, res) => {
  const { type, description, propId, credit, debit } = req.body;
  try {
    //finding users with email id
    if (type === 'credit') {
      await businessProp.create({
        credit,
        description,
        propId
      })
      success = true;
      let message = "saved"
      res.json({ success, message });
    } else if (type === 'debit') {
      await businessProp.create({
        debit,
        description,
        propId
      })
      success = true;
      let message = "saved"
      res.json({ success, message });
    } else {
      success = false;
      let message = "not saved"
      res.json({ success, message });
    }
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Sever Error Occured");
  }
})

const getProfile = async(req, res) => {
  const id = req.user.user.id;
  console.log(id, "profile id");
  try {
    const profile = await business.findById(id, {password: 0});
    // profile.select("-password")
    res.json({success: true, msg: "profile details sended successfully", profile});
  } catch (error) {
    console.log(error);
  }
}

module.exports = { registrationOTP, verifyBusiness, resendOtp, createBusinessUser, BusinessLogin, getAllBusiness, getAllBusinessCrop, getAllBusinessProp, saveBusinessCrop, saveBusinessProp, getProfile }