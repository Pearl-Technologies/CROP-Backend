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
const { User, MissingCrop } = require("../../models/User")
const Order = require("../../models/Order")
const { createBusinessAudit } = require("../adminController/audit")
const {
  BusinessHolidays,
} = require("../../models/businessModel/businessHolidays")
const { Product } = require("../../models/businessModel/product")
const invoiceAndPaymentNotification = require("../../models/businessModel/businessNotification/invoiceAndPaymentNotification")
const mongoose = require("mongoose")
const accountNotification = require("../../models/businessModel/businessNotification/accountNotification")
const { smsOTP } = require("../../utils/smsOtp")
const generalNotification = require("../../models/businessModel/businessNotification/generalNotification")
// const {businessFeedback} = require("../../models/businessModel/BusinessFeedback")
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

const mobileRegisterOtp = async (req, res) => {
  const { mobile, type } = req.body
  try {
    if (parseInt(type) == 1) {
      const businessFind = await business.find({ mobile })
      if (businessFind.length > 0) {
        return res
          .status(409)
          .send({ success: false, msg: "Mobile Number Already Exist" })
      }
    }
    // const businessFind = await business.find({ mobile })
    // if (businessFind.length > 0) {
    //   return res
    //     .status(409)
    //     .send({ success: false, msg: "Mobile Number Already Exist" })
    // }
    // const subject = "Crop Business Account Registration OTP"
    // const msg = "Registration OTP"
    // const resMsg = "OTP Sent Successfully"
    // const otpType = "Business Registration"
    // const userType = "Business"
    var otp = Math.floor(100000 + Math.random() * 900000)
    const msg = await smsOTP(mobile, otp)
    if (msg.data.meta.code == 200) {
      res.status(200).json({ msg: "OTP Sent Successfully", status: 200 })
    } else {
      res
        .status(500)
        .json({ msg: "OTP Failed", status: 500, data: msg.data.meta.status })
    }
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
  const guid = process.env.ABN_GUID
  try {
    const abnNumberFind = await business.find({ abnNumber })
    if (abnNumberFind.length > 0) {
      return res
        .status(500)
        .send({ success: false, msg: "ABN Number Already REgistered" })
    }
    const { default: fetch } = await import("node-fetch")
    const api = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${abnNumber}&callback=callback&guid=${guid}`
    console.log({ api })
    const response = await fetch(api, {
      method: "get",
    })
    let responseBody = await response.buffer()
    if (responseBody[0] === 0x1f && responseBody[1] === 0x8b) {
      const decompressedStream = new Readable().wrap(
        responseBody.pipe(createGunzip())
      )
      responseBody = await decompressedStream.buffer()
    }
    const responseText = responseBody.toString("utf-8")
    const jsonStartIndex = responseText.indexOf("{")
    const jsonEndIndex = responseText.lastIndexOf("}")
    const jsonString = responseText.substring(jsonStartIndex, jsonEndIndex + 1)

    const data = JSON.parse(jsonString)

    console.log({ data })

    if (data.Message == "Search text is not a valid ABN or ACN") {
      console.log(data, "not valid")
      return res
        .status(401)
        .send({ success: false, msg: "Not Valid ABN Number" })
    }
    if (data.AbnStatus == "Cancelled") {
      console.log(data, "ABN Account Cancelled")
      return res
        .status(401)
        .send({ success: false, msg: "ABN Account Cancelled" })
    }
    console.log(data, "valid")
    return res.status(200).send({
      success: true,
      msg: "ABN Number Verified",
      abnDetails: data,
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
    createBusinessAudit(businessFind[0]._id, "PIN Changed Successfully")
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
    createBusinessAudit(
      businessFind._id,
      "Communication Preference Updated Successfully"
    )
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
    console.log(user.croppoints)
    if (user == null) {
      return res
        .status(404)
        .send({ success: false, msg: "Crop Details Not Found" })
    }
    const userName =
      user.name.fName + " " + user.name.mName + " " + user.name.lName
    return res.status(200).send({
      success: true,
      cropDetails: {
        cropId: user.cropid,
        cropPoints: user.croppoints,
        userName,
        userId: user._id,
      },
      msg: "User Details Sended Successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Sever Error")
  }
}

const customerCreditOrDebitCrops = async (req, res) => {
  const { userId, credit, debit, cropPoints } = req.body
  try {
    const user = await User.findById(userId)
    console.log(user.croppoints)
    if (user == null) {
      return res.status(404).send({ success: false, msg: "User Not Found" })
    }
    let croppoints = user.croppoints
    if (credit) {
      croppoints = Number(croppoints) + Number(cropPoints)
    }
    if (debit) {
      croppoints = Number(croppoints) - Number(cropPoints)
    }
    console.log({ cropPoints })
    console.log({ croppoints })
    console.log("added", Number(croppoints) + Number(cropPoints))
    await User.findByIdAndUpdate({ _id: userId }, { croppoints })
    // console.log({ customer })
    if (credit) {
      return res.status(200).send("CROP's Credited Successfully")
    }
    if (debit) {
      return res.status(200).send("CROP's Debited Successfully")
    }
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
    createBusinessAudit(businessFind._id, "PIN Changed Successfully")
    const accNotification = new accountNotification({
      type: "pinChange",
      desc: "Your Pin Resetted Successfully",
      businessId: businessFind._id,
    })
    await accNotification.save()
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
    createBusinessAudit(id, "Communication Preference Updated Successfully")
    return res.status(200).send({
      success: true,
      msg: "Communication Preference Updated Successfully",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Sever Error Occured")
  }
}

// const createOrUpdateFeedback = async (req, res) => {
//   const businessId = req.user.user.id
//   try {
//     const businessFeedbackFind = await businessFeedback.find({ businessId })
//     if (businessFeedbackFind.length <= 0) {
//       req.body.businessId = businessId
//       console.log(req.body)
//       const feedBack = new businessFeedback(req.body)
//       await feedBack.save()
//       return res.status(200).json({ success: true, feedBack })
//     } else {
//       console.log("exist running")
//       console.log("body", req.body)
//       const feedBack = await businessFeedback.findByIdAndUpdate(
//         { _id: businessFeedbackFind[0]._id },
//         req.body
//       )
//       return res.status(201).json({ success: true, feedBack })
//     }
//   } catch (error) {
//     console.log("err start", error, "error end")
//     res.status(500).send("Internal Sever Error Occured")
//   }
// }

// const getFeedback = async (req, res) => {
//   console.log(req.user)
//   const businessId = req.user.user.id
//   console.log("Api running")
//   console.log({ businessId })
//   try {
//     const feedBack = await businessFeedback.findOne({ businessId })
//     return res.status(200).send({ success: true, feedBack })
//   } catch (error) {
//     console.log("err start", error, "error end")
//     res.status(500).send("Internal Sever Error Occured")
//   }
// }

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
    createBusinessAudit(businessId, "profile image updated")
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
    return res.status(200).send({ success: true, holidayByState })
  } catch (error) {
    console.log(error)
  }
}

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
          businessId: new ObjectId(businessId),
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
          user: businessId,
        },
      },
    ])
    return res.status(200).send({ statement })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const getSinglePurchasedProductStatement = async (req, res) => {
  const businessId = req.user.user.id
  const { itemId, oId } = req.params
  console.log({ itemId, oId, businessId })
  try {
    const statement = await invoiceAndPaymentNotification.aggregate([
      {
        $match: {
          businessId: new ObjectId(businessId),
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
          user: businessId,
          "purchaseOrder.orderId": {
            $eq: ObjectId("644b9f8a37eef104602d0745"),
          },
          "item._id": {
            $eq: "643e73e897d0469d9661b66b",
          },
        },
      },
    ])
    return res.status(200).send({ statement: statement[0] })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const getAccountNotification = async (req, res) => {
  const { type } = req.params
  const businessId = req.user.user.id
  try {
    const accountNotifications = await accountNotification.find({
      type,
      businessId,
    })
    return res.status(200).send({ accountNotifications })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const getGeneralNotification = async (req, res) => {
  const { type } = req.params
  const businessId = req.user.user.id
  try {
    const generaltNotifications = await generalNotification.find({
      type,
      businessId,
    })
    return res.status(200).send({ generaltNotifications })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const getMissingCropsByBusiness = async (req, res) => {
  const businessId = req.user.user.id
  try {
    console.log({ businessId })
    const missingCrops = await MissingCrop.aggregate([
      { $unwind: "$product_id" },
      { $match: { "product_id.business": { $eq: ObjectId(businessId) } } },
      {
        $lookup: {
          from: "business_products",
          localField: "product_id.product",
          foreignField: "_id",
          as: "product",
        },
      },
      // {
      //   $lookup: {
      //     from: "users_customers",
      //     localField: "user_id",
      //     foreignField: "_id",
      //     as: "user",
      //   },
      // },
      {
        $project: {
          product: { title: 1 },
          doi: 1,
          product_id: 1,
          reason: 1,
          invoice_id: 1,
          user_id: 1,
          status: 1,
          action: 1,
          // user: { name: 1 },
        },
      },
    ])
    return res.status(200).send({
      count: missingCrops.length,
      missingCrops,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const rejectMisssingCropsByBusiness = async (req, res) => {
  const { missingCropId, productId } = req.body
  try {
    await MissingCrop.updateOne(
      {
        _id: ObjectId(missingCropId),
        "product_id._id": ObjectId(productId),
      },
      { $set: { "product_id.$.status": "rejected" } }
    )
    return res.status(200).send("Customer Missing CROPs Rejected")
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const creditMissingCropsByBusiness = async (req, res) => {
  const { customerId, creditCropPoints, missingCropId, productId } = req.body
  try {
    const user = await User.findById(customerId)
    const croppoints = user.croppoints + creditCropPoints
    await User.findByIdAndUpdate({ _id: customerId }, { croppoints })
    await MissingCrop.updateOne(
      {
        _id: ObjectId(missingCropId),
        "product_id._id": ObjectId(productId),
      },
      { $set: { "product_id.$.status": "credited" } }
    )
    return res.status(200).send("Missing CROP's Credited To Customer")
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const getHolidayListByBusiness = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const businessDetails = await business.findById(businessId)
    const businessState = businessDetails.address[0].state
    const holidays = await BusinessHolidays.find({ state: businessState })
    return res.status(200).send({ holidays })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

module.exports = {
  emailRegisterOtp,
  mobileRegisterOtp,
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
  customerCreditOrDebitCrops,
  pinChange,
  updateCommunicationPreference,
  // createOrUpdateFeedback,
  // getFeedback,
  getHolidayByState,
  getPurchasedProductStatement,
  getSinglePurchasedProductStatement,
  getMissingCropsByBusiness,
  rejectMisssingCropsByBusiness,
  creditMissingCropsByBusiness,
  getAccountNotification,
  getGeneralNotification,
  getHolidayListByBusiness,
}

// const getMissingCropsByBusiness = async (req, res) => {
//   const businessId = req.user.user.id
//   try {
//     console.log({ businessId })
//     const missingCrops = await Product.aggregate([
//       { $match: { user: ObjectId(businessId) } },
//       {
//         $lookup: {
//           from: "missing_crop_customers",
//           let: { productId: "$_id" },
//           pipeline: [
//             {
//               $unwind: "$product_id",
//             },
//             {
//               $match: {
//                 $expr: {
//                   $eq: ["$product_id", "$$productId"],
//                 },
//               },
//             },
//           ],
//           as: "missingCrops",
//         },
//       },
//       {
//         $match: {
//           missingCrops: {
//             $elemMatch: {
//               action: "pending",
//             },
//           },
//         },
//       },
//       {
//         $unwind: "$missingCrops",
//       },
//       {
//         $project: {
//           _id: 1,
//           title: 1,
//           missingCrops: 1,
//         },
//       },
//     ])
//     return res.status(200).send({
//       count: missingCrops.length,
//       missingCrops,
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).send("Internal Server Error")
//   }
// }
