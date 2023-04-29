const business = require("../../models/businessModel/business")
const businessCrop = require("../../models/businessModel/businessCrop")
const businessProp = require("../../models/businessModel/businessProp")
const businessNotification = require("../../models/businessModel/businessNotification")
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const { Otp } = require("../../models/businessModel/Otp")
const { sendMail } = require("../../utils/sendMail")
const { User } = require("../../models/User")
const Order = require("../../models/Order")
const {
  BusinessHolidays,
} = require("../../models/businessModel/businessHolidays")
const { Product } = require("../../models/businessModel/product")
const invoiceAndPaymentNotification = require("../../models/businessModel/businessNotification/invoiceAndPaymentNotification")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

const JWT_SECRET = "CROP@12345"

const emailRegisterOtp = async (req, res) => {
  const { email } = req.body
  try {
    const businessFind = await business.find({ email })
    if (businessFind.length > 0) {
      return res
        .status(409)
        .send({ success: false, msg: "Email Already Exist" })
    }
    const subject = "Crop Business Account Registration OTP"
    const msg = "Registration OTP"
    const resMsg = "OTP Sent Successfully"
    const otpType = "Business Registration"
    const userType = "Business"
    return sendMail(email, subject, msg, resMsg, otpType, userType, res)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    const otpFind = await Otp.find({ email }).sort({ _id: -1 }).limit(1)
    console.log({ otpFind })
    if (otpFind.length < 1) {
      return res.status(500).send({ success: false, msg: "OTP Not Found" })
    }
    if (otpFind[0].verified) {
      return res.status(500).send({ success: false, msg: "OTP Already Used" })
    }
    console.log(otpFind[0].otp)
    if (otpFind[0].otp != otp) {
      return res.status(409).send({ success: false, msg: "Invalid OTP" })
    }
    await Otp.findByIdAndUpdate({ _id: otpFind[0]._id }, { verified: true })
    return res.status(200).send({ success: true, msg: "OTP Verified" })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" })
  }
}

const verifyAdbnNumber = async (req, res) => {
  const { abnNumber } = req.body
  try {
    const abnNumberFind = await business.find({ abnNumber })
    if (abnNumberFind.length > 0) {
      return res
        .status(500)
        .send({ success: false, msg: "ABN Number Already REgistered" })
    }
    const { default: fetch } = await import("node-fetch")
    const response = await fetch(
      `https://abn-search.p.rapidapi.com/abn/current?q=${abnNumber}`,
      {
        method: "get",
        headers: {
          "X-RapidAPI-Key":
            "7ddf1639fbmsh33d69adb9550963p16f529jsn706069293abe ",
          "X-RapidAPI-Host": "abn-search.p.rapidapi.com",
        },
      }
    )
    const data = await response.json()
    if (data.current == null) {
      console.log(data, "not valid")
      return res
        .status(401)
        .send({ success: false, msg: "ABN Number Verification Failed" })
    }
    if (data.current.abn_status == "Cancelled") {
      console.log(data, "ABN Account Cancelled")
      return res
        .status(401)
        .send({ success: false, msg: "ABN Account Cancelled" })
    }
    console.log(data, "valid")
    return res.status(200).send({
      success: true,
      msg: "ABN Number Verified",
      abnDetails: data.current,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const createBusinessAccount = async (req, res) => {
  const {
    email,
    fName,
    mName,
    lname,
    terms,
    promoCode,
    pin,
    abnNumber,
    businessName,
    title,
    notification,
  } = req.body
  // cropId, propId, promoCode
  try {
    const findBusiness = await business.find({ email })
    if (findBusiness.length > 0) {
      return res.status(409).send("Account Already Exist")
    }
    const lastAccount = await business.find({}).sort({ _id: -1 }).limit(1)
    let cropId = ""
    if (lastAccount.length < 1) {
      cropId = "BUS0000001"
    } else {
      let prevCropId = lastAccount[0].cropId
      prevCropId = prevCropId.split("S")
      let id = Number(prevCropId[1]) + 1
      cropId = "BUS000000" + id
    }
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(pin, salt)
    const account = new business({
      email,
      fName,
      mName,
      lname,
      terms,
      promoCode,
      pin: password,
      cropId,
      ABN: abnNumber,
      businessName,
      title,
      notification,
    })
    await account.save()
    const data = {
      user: {
        id: account._id,
      },
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    return res
      .status(201)
      .send({ success: true, authToken, msg: "Account Created Successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
}

const getBusinessProfile = async (req, res) => {
  const id = req.user.user.id
  try {
    const profile = await business.findById(id)
    if (!profile) {
      return res.status(404).send({ success: false, msg: "Account Not Found" })
    }
    return res.status(200).send({ profile })
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
}

const businessLogin = async (req, res) => {
  const { email, mobile, cropId, pin } = req.body
  try {
    let user = null
    if (email != "") {
      user = await business.findOne({ email })
    } else if (cropId != "") {
      user = await business.findOne({ cropId })
    } else if (mobile != "") {
      user = await business.findOne({ mobile })
    }
    if (!user) {
      return res
        .status(400)
        .send({ error: "Please try to login with correct credentials" })
    }
    const passwordCompare = await bcrypt.compare(pin, user.pin)
    if (!passwordCompare) {
      return res.status(400).json({
        success: false,
        error: "Please try to login with correct credentials",
      })
    }
    const data = {
      user: {
        id: user.id,
      },
    }
    await businessNotification.create({
      type: "account",
      desc: "account login successfully",
      cropId: user.cropId,
    })
    const authToken = jwt.sign(data, JWT_SECRET)
    res.status(200).send({ success: true, authToken })
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Sever Error")
  }
}

const forgetPassword = async (req, res) => {
  const { email, cropId } = req.body
  try {
    let businessFind = []
    let findedEmail = ""
    if (email != "") {
      businessFind = await business.find({ email })
      findedEmail = email
    } else if (cropId != "") {
      businessFind = await business.find({ cropId })
      findedEmail = businessFind[0].email
    }
    if (businessFind.length < 1) {
      return res
        .status(409)
        .send({ success: false, message: "Account Not Found Please Register" })
    }
    const subject = "Crop Business Account PIN Reset OTP"
    const msg = "Forget Password OTP"
    const resMsg = "OTP Sent Successfully"
    const otpType = "Business Reset Password"
    const userType = "Business"
    return sendMail(findedEmail, subject, msg, resMsg, otpType, userType, res)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const validateForgetOtp = async (req, res) => {
  try {
    let { email, cropId, otp } = req.body
    let otpFind = []
    let findedEmail = ""
    if (email != "") {
      otpFind = await Otp.find({ email }).sort({ _id: -1 }).limit(1)
      findedEmail = email
    } else if (cropId != "") {
      let businessFind = await business.find({ cropId })
      email = businessFind[0].email
      console.log({ email }, "froget")
      otpFind = await Otp.find({ email }).sort({ _id: -1 }).limit(1)
    }
    if (otpFind.length < 1) {
      return res.status(500).send({ success: false, msg: "OTP Not Found" })
    }
    if (otpFind[0].verified) {
      return res.status(500).send({ success: false, msg: "OTP Already Used" })
    }
    console.log(otpFind[0].otp)
    if (otpFind[0].otp != otp) {
      return res.status(500).send({ success: false, msg: "Invalid OTP" })
    }
    await Otp.findByIdAndUpdate({ _id: otpFind[0]._id }, { verified: true })
    return res.status(200).send({ success: true, msg: "OTP Verified" })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" })
  }
}

const resetPassword = async (req, res) => {
  const { email, cropId, pin } = req.body
  try {
    let businessFind = []
    if (cropId != "") {
      businessFind = await business.find({ cropId })
      if (businessFind.length < 1) {
        return res.status(400).send({ error: "Account Not Found" })
      }
    } else if (email != "") {
      businessFind = await business.find({ email })
      if (businessFind.length < 1) {
        return res.status(400).send({ error: "Account Not Found" })
      }
    }
    const salt = await bcrypt.genSalt(10)
    let password = await bcrypt.hash(pin, salt)
    await business.findByIdAndUpdate(
      { _id: businessFind[0]._id },
      { pin: password }
    )
    return res.status(201).send({ success: true, msg: "PIN Reset Success" })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" })
  }
}

const updateProfile = async (req, res) => {
  const id = req.user.user.id
  console.log("profile", req.body)
  try {
    const businessFind = await business.findById(id)
    if (!businessFind) {
      return res.status(404).send({ success: false, msg: "Account Not Found" })
    }
    await business.findByIdAndUpdate({ _id: businessFind._id }, req.body)
    return res.status(200).send({
      success: true,
      msg: "Communication Preference Updated Successfully",
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" })
  }
}

const resendOtp = async (req, res) => {
  const email = req.body.email
  var otp = Math.floor(100000 + Math.random() * 900000)

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

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "resetted password",
    text: `OTP GENERATED ${otp}`,
  }

  transporter.sendMail(mailOptions, async (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send({
        message: "Enter the correct email id",
        status: "false",
        data: [],
      })
    } else {
      res
        .status(200)
        .send({ message: "otp sent successsfully", status: "true", data: [] })
      const result = await Otp.updateOne(
        { email: email },
        { $set: { otp: otp } }
      )
    }
  })
}

const getAllBusiness = async (req, res) => {
  try {
    //finding users with email id
    let user = await business.find()

    if (!user) {
      success = false
      return res.status(400).json({ error: "no record found" })
    }

    success = true
    res.json({ success, user })
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message)
    //for log in response
    res.status(500).send("Internal Sever Error Occured")
  }
}

const getAllBusinessCrop = async (req, res) => {
  try {
    //finding users with email id
    let user = await businessCrop.find()

    if (!user) {
      success = false
      return res.status(400).json({ error: "no data found" })
    }

    success = true
    res.json({ success, user })
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message)
    //for log in response
    res.status(500).send("Internal Sever Error Occured")
  }
}

//saving crop
const saveBusinessCrop = async (req, res) => {
  const { type, description, cropId, credit, debit } = req.body
  try {
    //finding users with email id
    let user = await businessCrop.find()
    if (type === "credit") {
      await businessCrop.create({
        credit,
        description,
        cropId,
      })
      success = true
      let message = "saved"
      res.json({ success, message })
    } else if (type === "debit") {
      await businessCrop.create({
        debit,
        description,
        cropId,
      })
      success = true
      let message = "saved"
      res.json({ success, message })
    } else {
      success = false
      let message = "not saved"
      res.json({ success, message })
    }
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message)
    //for log in response
    res.status(500).send("Internal Sever Error Occured")
  }
}
const saveBusinessProp = async (req, res) => {
  const { type, description, propId, credit, debit } = req.body
  try {
    //finding users with email id
    if (type === "credit") {
      await businessProp.create({
        credit,
        description,
        propId,
      })
      success = true
      let message = "saved"
      res.json({ success, message })
    } else if (type === "debit") {
      await businessProp.create({
        debit,
        description,
        propId,
      })
      success = true
      let message = "saved"
      res.json({ success, message })
    } else {
      success = false
      let message = "not saved"
      res.json({ success, message })
    }
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message)
    //for log in response
    res.status(500).send("Internal Sever Error Occured")
  }
}

const getProfile = async (req, res) => {
  const id = req.user.user.id
  console.log(id, "profile id")
  try {
    const profile = await business.findById(id, { password: 0 })
    // profile.select("-password")
    res.json({
      success: true,
      msg: "profile details sended successfully",
      profile,
    })
  } catch (error) {
    console.log(error)
  }
}

const getUserCropDetails = async (req, res) => {
  const { email } = req.params
  console.log(email, "api hitting")
  try {
    const user = await User.findOne({ email })
    console.log(user)
    if (user == null) {
      return res
        .status(404)
        .send({ success: false, msg: "Crop Details Not Found" })
    }
    const userName =
      user[0].name.fName + " " + user[0].name.mName + " " + user[0].name.lName
    return res.status(200).send({
      success: true,
      cropDetails: {
        cropId: user[0].cropid,
        cropPoints: user[0].croppoints,
        userName,
      },
      msg: "User Details Sended Successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Sever Error")
  }
}

const pinChange = async (req, res) => {
  const { oldPin, newPin } = req.body
  const id = req.user.user.id
  try {
    const businessFind = await business.findById(id)
    const passwordCompare = await bcrypt.compare(oldPin, businessFind.pin)
    if (!passwordCompare) {
      return res.status(400).json({
        success: false,
        msg: "Old PIN is incorrect",
      })
    }
    const salt = await bcrypt.genSalt(10)
    pin = await bcrypt.hash(newPin, salt)
    await business.findByIdAndUpdate({ _id: businessFind._id }, { pin })
    return res.status(201).send({ success: true, msg: "PIN Reset Success" })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Sever Error Occured")
  }
}

const updateCommunicationPreference = async (req, res) => {
  // const { notification, smsNotification, emailNotification } = req.body
  const id = req.user.user.id
  try {
    console.log(req.body)
    await business.findByIdAndUpdate({ _id: id }, req.body)
    return res.status(200).send({
      success: true,
      msg: "Communication Preference Updated Successfully",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Sever Error Occured")
  }
}

const createOrUpdateFeedback = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const businessFeedBackFind = await businessFeedBack.find({ businessId })
    if (businessFeedBackFind.length <= 0) {
      req.body.businessId = businessId
      console.log(req.body)
      const feedBack = new businessFeedBack(req.body)
      await feedBack.save()
      return res.status(200).json({ success: true, feedBack })
    } else {
      console.log("exist running")
      console.log("body", req.body)
      const feedBack = await businessFeedBack.findByIdAndUpdate(
        { _id: businessFeedBackFind[0]._id },
        req.body
      )
      return res.status(201).json({ success: true, feedBack })
    }
  } catch (error) {
    console.log("err start", error, "error end")
    res.status(500).send("Internal Sever Error Occured")
  }
}

const getFeedback = async (req, res) => {
  console.log(req.user)
  const businessId = req.user.user.id
  console.log("Api running")
  console.log({ businessId })
  try {
    const feedBack = await businessFeedBack.findOne({ businessId })
    return res.status(200).send({ success: true, feedBack })
  } catch (error) {
    console.log("err start", error, "error end")
    res.status(500).send("Internal Sever Error Occured")
  }
}

const uploadProfileImage = async (req, res) => {
  try {
    console.log("api upload running")
    const businessId = req.user.user.id
    const fileName = req.files[0].filename
    console.log(fileName, "fileName")
    const businessFind = await business.findByIdAndUpdate(
      { _id: businessId },
      { avatar: fileName }
    )
    console.log(businessFind, "business")
    return res.status(200).send({ success: true })
  } catch (error) {
    console.log(error)
  }
}

const getHolidayByState = async (req, res) => {
  const { state } = req.body
  try {
    const holidayByState = await BusinessHolidays.find({ state })
    return re.status(200).send({ success: true, holidayByState })
  } catch (error) {
    console.log(error)
  }
}

const getPromosByBusiness = async (req, res) => {}

// const updateAddress = async () => {
//   const line1 = Math.floor(100 + Math.random() * 900)
//   await business.updateMany({}, [
//     {
//       $set: {
//         address: {
//           $map: {
//             input: "$address",
//             as: "addr",
//             in: {
//               line1: line1,
//               line2: "line2",
//               state: "$$addr.state",
//               pincode: { $toInt: "$$addr.pincode" },
//             },
//           },
//         },
//       },
//     },
//   ])
//   console.log("address updated")
// }
// // #00448b
// // #549cda
// updateAddress()

// const updateProductImage = async () => {
//   const newImage = ["file-1681724657651.jpg", "file-1681724657652.jpg"]
//   console.log("product images updated")
//   await Product.updateMany({ sector: "fuel" }, { $set: { sector: "Fuel" } })
//     .then(result => {
//       console.log(`${result.modifiedCount} documents updated`)
//     })
//     .catch(err => {
//       console.error(err)
//     })
// }

// updateProductImage()

const getPurchasedProductStatement = async (req, res) => {
  const businessId = req.user.user.id
  console.log({ businessId })
  try {
    const statement = await invoiceAndPaymentNotification.aggregate([
      {
        $match: {
          businessId: new ObjectId("643cd01d448a0837e2cf24cc"),
        },
      },
      {
        $lookup: {
          from: "customer_payment_trackers",
          localField: "purchaseOrder.orderId",
          foreignField: "_id",
          as: "orders",
        },
      },
      {
        $unwind: {
          path: "$orders",
        },
      },
      {
        $unwind: {
          path: "$orders.cartDetails.cartItems",
        },
      },
      {
        $addFields: {
          item: "$orders.cartDetails.cartItems",
        },
      },
      {
        $addFields: {
          user: "$item.user",
        },
      },
      {
        $match: {
          user: "643cd01d448a0837e2cf24cc",
        },
      },
    ])
    return res.status(200).send({ statement })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

module.exports = {
  emailRegisterOtp,
  verifyRegisterOtp,
  verifyAdbnNumber,
  createBusinessAccount,
  getBusinessProfile,
  businessLogin,
  forgetPassword,
  validateForgetOtp,
  resetPassword,
  updateProfile,
  resendOtp,
  getAllBusiness,
  getAllBusinessCrop,
  saveBusinessCrop,
  saveBusinessProp,
  getProfile,
  uploadProfileImage,
  getUserCropDetails,
  pinChange,
  updateCommunicationPreference,
  createOrUpdateFeedback,
  getFeedback,
  getHolidayByState,
  getPurchasedProductStatement,
}
