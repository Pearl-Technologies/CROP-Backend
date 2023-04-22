const express = require("express")
const {
  emailRegisterOtp,
  verifyRegisterOtp,
  verifyAdbnNumber,
  createBusinessAccount,
  businessLogin,
  getBusinessProfile,
  getUserCropDetails,
  forgetPassword,
  validateForgetOtp,
  resetPassword,
  pinChange,
  updateCommunicationPreference,
  updateProfile,
  createOrUpdateFeedback,
  getFeedback,
  uploadProfileImage,
  getHolidayByState,
} = require("../../controller/businessController/business.js")
const {
  getAllBusinessCrop,
  saveBusinessCrop,
  saveBusinessProp,
  resendOtp,
  getAllBusiness,
} = require("../../controller/businessController/business")
const authorization = require("../../middleware/verifyToken")
const { upload } = require("../../utils/imageUpload")

const router = express.Router()
const {
  createServices,
  getService,
} = require("../../controller/businessController/services")
const {
  createOrUpdateCropRules,
  getCropRules,
  createOrUpdateExtendBonusCrops,
  getExtendBonusCrops,
  createOrUpdateSlashRedeemptionCrops,
  getSlashRedemptionCrop,
  createOrUpdateHappyHours,
  getHappyHours,
  createOrUpdateOtherServices,
  getOtherServices,
} = require("../../controller/businessController/crop")

router.post("/email-register-otp", emailRegisterOtp)
router.post("/verify-register-otp", verifyRegisterOtp)
router.post("/verify-abn-number", verifyAdbnNumber)
router.post("/signup", createBusinessAccount)
router.post("/signin", businessLogin)
router.post("/forget-password", forgetPassword)
router.post("/verify-forget-otp", validateForgetOtp)
router.post("/reset-password", resetPassword)
router.put("/pin-change", authorization, pinChange)
router.get("/get-profile", authorization, getBusinessProfile)
router.put("/update-profile", authorization, updateProfile)
router.put(
  "/update-communication-preference",
  authorization,
  updateCommunicationPreference
)
router.post(
  "/profile-img",
  authorization,
  upload.array("file", 20),
  uploadProfileImage
)

router.post("/services", authorization, createServices)
router.get("/services", authorization, getService)

router.get("/extend-crop-bonus", authorization, getExtendBonusCrops)
router.post("/extend-crop-bonus", authorization, createOrUpdateExtendBonusCrops)

router.post("/crop-rules", authorization, createOrUpdateCropRules)
router.get("/crop-rules", authorization, getCropRules)

router.post(
  "/slash-redemption-crop",
  authorization,
  createOrUpdateSlashRedeemptionCrops
)
router.get("/slash-redemption-crop", authorization, getSlashRedemptionCrop)

router.post("/happy-hours", authorization, createOrUpdateHappyHours)
router.get("/happy-hours", authorization, getHappyHours)

router.post("/other-services", authorization, createOrUpdateOtherServices)
router.get("/other-services", authorization, getOtherServices)
router.get("/get-user-crop-details/:email", authorization, getUserCropDetails)

router.post("/feedback", authorization, createOrUpdateFeedback)
router.get("/feedback", authorization, getFeedback)

router.get("/get-holidays-by-state", authorization, getHolidayByState)

module.exports = router
