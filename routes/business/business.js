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
  getPurchasedProductStatement,
  customerCreditOrDebitCrops,
  getAccountNotification,
  getMissingCropsByBusiness,
  rejectMisssingCropsByBusiness,
  creditMissingCropsByBusiness,
  getSinglePurchasedProductStatement,
  mobileRegisterOtp,
  getGeneralNotification,
  getHolidayListByBusiness,
} = require("../../controller/businessController/business.js")

const authorization = require("../../middleware/verifyToken")
const { upload } = require("../../utils/imageUpload")

const router = express.Router()
const {
  createServices,
  getService,
  createStoreServices,
  getStoreService,
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
const {
  createPointsTransactionNotification,
  createSalesNotification,
  createProgramChangesNotification,
} = require("../../controller/businessController/businessNotification/accountNotification.js")
const {
  getPaymentNotification,
  getRedeemNotification,
} = require("../../controller/businessController/businessNotification/invoiceAndPaymentNotification.js")
const {
  getProductsSaleCountByMonthlyWise,
  getProductsSaleCountByYear,
  getProductsSaleCountByMonth,
} = require("../../controller/businessController/dasboard.js")

router.post("/email-register-otp", emailRegisterOtp)
router.post("/mobile-register-otp", mobileRegisterOtp)
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

router.get(
  "/get-purchased-product-statement",
  authorization,
  getPurchasedProductStatement
)
router.get(
  "/get-single-purchased-product-statement/:oId/:itemId",
  authorization,
  getSinglePurchasedProductStatement
)
router.post("/services", authorization, createServices)
router.get("/services", authorization, getService)
router.post("/store/services", authorization, createStoreServices)
router.get("/store/services", authorization, getStoreService)

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
router.post(
  "/customer-credit-debit-crops",
  authorization,
  customerCreditOrDebitCrops
)

router.post("/feedback", authorization, createOrUpdateFeedback)
router.get("/feedback", authorization, getFeedback)

router.get("/get-holidays-by-state", authorization, getHolidayByState)

router.get(
  "/get-account-notification/:type",
  authorization,
  getAccountNotification
)

router.get(
  "/get-general-notification/:type",
  authorization,
  getGeneralNotification
)

router.get("/get-missing-crops", authorization, getMissingCropsByBusiness)
router.put(
  "/reject-missing-crops",
  authorization,
  rejectMisssingCropsByBusiness
)
router.put("/credit-missing-crops", authorization, creditMissingCropsByBusiness)

router.post(
  "/points-transaction-notification",
  authorization,
  createPointsTransactionNotification
)

router.post("/sales-notification", authorization, createSalesNotification)
router.get("/get-payment-notification", authorization, getPaymentNotification)
router.get("/get-redeem-notification", authorization, getRedeemNotification)

router.get(
  "/dashboard/get-product-sale-month",
  authorization,
  getProductsSaleCountByMonth
)
router.get(
  "/dashboard/get-product-sale-year",
  authorization,
  getProductsSaleCountByYear
)
router.get(
  "/dashboard/get-product-sale-count-monthly",
  authorization,
  getProductsSaleCountByMonthlyWise
)
router.get("/get-holiday-list", authorization, getHolidayListByBusiness)


module.exports = router
