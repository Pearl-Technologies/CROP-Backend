const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");
const {
  adminLogin,
  adminPasswordReset,
  getAdminData,
  passwordRest_email
} = require("../controller/superAdminController/user");
const {
  getAccountBalance,
  updateAccountBalance,
  saveAccountBalance,
} = require("../controller/adminController/accountBalance");
const {
  CropTransaction,
  GetCropDetails,
} = require("../controller/adminController/crop");
const {
  PropTransaction,
  GetAllProp,
} = require("../controller/adminController/prop");
// const updateTier = require("../controller/adminController/updateTier");
const {
  setBasePrice,
  getBasePrice,
  updateBasePrice,
} = require("../controller/adminController/basePrice");
const {
  publishOffer,
} = require("../controller/adminController/publishedOffer");
const {getAllProduct} = require("../controller/adminController/BusinessData/product")
const {
  createAudit,
  getAuditReport,
  createBusinessAudit, getBusinessAuditReport
} = require("../controller/adminController/audit");
const {
  createMilestoneData,
  getMilestoneData,
  updateMilestoneData
} = require("../controller/adminController/milestone");
const {
  createData,
  updateData,
  getData,
} = require("../controller/adminController/adminData");
const {
  createCustomerComplain,
  getCustomerComplain,
  updateCustomerComplain,
} = require("../controller/adminController/admin_customer_complain");
const {
  createBusinessComplain,
  getBusinessComplain,
  updateBusinessComplain,
} = require("../controller/adminController/admin_business_complain");
const {
  createCustomerRequest,
  getCustomerRequest,
  updateCustomerRequest,
} = require("../controller/adminController/admin_customer_request");
const {
  createBusinessRequest,
  getBusinessRequest,
  updateBusinessRequest,
} = require("../controller/adminController/admin_business_request");
const {
  getBusinessSurvey,
  createBusinessSurvey,
  getCustomerSurvey,
  createCustomerSurvey,
} = require("../controller/adminController/admin_survey");
const {
  getPropValues,
  updateStoreProp,
  savePropValues,
} = require("../controller/adminController/admin_store_props");
const {updateAdminUser, updateAdminUserPassword} = require("../controller/adminController/admin_update_user");
const {createNotification, getAllNotifications} = require("../controller/adminController/admin_notification") 
const {createCustomerInvoice, createBusinessInvoice, getAllBusinessInvoice, getAllCustomerInvoice} = require("../controller/adminController/admin_invoice")
const {getPropValuation, createPropValuation, updatePropValuation} = require('../controller/adminController/admin_prop_valuation')
const {createCustomerAccountNotification, getCustomerAccountNotification, updateCustomerAccountNotification} = require('../controller/adminController/Notification/customerAccountNotification')
const {createCustomerGeneralNotification, getCustomerGeneralNotification, updateCustomerGenearlNotification} = require("../controller/adminController/Notification/customerGeneralNotification")
const {createCustomerPurchaseAndRedeemNotification, getCustomerPurchaseAndRedeemNotification, updateCustomerPurchaseAndRedeemNotification} =  require("../controller/adminController/Notification/customerPurchaseAndRedeemtionNotification.js")
const {createCustomerRequestAndComplaintNotification, getCustomerRequestAndComplaintNotification, updateCustomerRequestAndComplaintNotification} = require('../controller/adminController/Notification/customerRequestAndComplainNotification')
const {createBusinessAccountNotification, getBusinessAccountNotification, updateBusinessAccountNotification} = require("../controller/adminController/Notification/businessAccountNotification")
const {createBusinessGeneralNotification, getBusinessGeneralNotification, updateBusinessGenearlNotification} = require("../controller/adminController/Notification/businessGeneralNotification")
const {createBusinessPurchaseAndRedeemNotification, getBusinessPurchaseAndRedeemNotification, updateBusinessPurchaseAndRedeemNotification} = require("../controller/adminController/Notification/businessPurchaseAndRedeemtionNotification")
const {createBusinessRequestAndComplaintNotification, getBusinessRequestAndComplaintNotification, updateBusinessRequestAndComplaintNotification} = require("../controller/adminController/Notification/businessRequestAndComplainNotification")

//customer
const {updateCustomerStatus, getAllCustomer, getAllOrders, customerProp, customerCrop, getAllCustomerProp, getAllCustomerCrop} =require("../controller/adminController/CustomerData/customer");

//

//Business

const {createEveryDayPromotionSlot, getSlot} =  require("../controller/adminController/Bidding/biddingProcess");
// const {getAllBusiness, businessCrop, getAllBusinessCrop, updateBusinessAccountStatus} = require("../controller/adminController/BusinessData/business");

const {getAllBusinessByContent, getAllBusiness, businessCrop, getAllBusinessCrop, updateBusinessAccountStatus} = require("../controller/adminController/BusinessData/business");
const {paymentLink} = require('../controller/adminController/PaymentController/payment')
//

// const accountTransaction =require("../controller/adminController/account")
//router

router.post(
  "/adminPasswordReset",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Passowrd must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("c_password", "Passowrd must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  adminPasswordReset
);
router.post("/passwordRest_email", passwordRest_email);
router.post(
  "/adminLogin",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Passowrd should not be blank").exists(),
  ],
  adminLogin
);

// router.post("/balanceUpdate", [body("cropId", "Cropid should not be empty").exists(), body("category", "category should not be empty").exists(), body("type", "type should not be blank").exists(), body("description", "description should not be blank").exists()], totalBalanceUpdate);
// router.post("/createBalanceAccount", [body("cropId", "cropId should not be blank").exists(), body("category", "category should not be blank").exists()], createTotalBalanceAccount);
// router.post("/accountTransaction", accountTransaction);
// router.post("/redeemtionLimit", [body("cropId", "cropId should not be blank").exists(), body("accountType", "accountType should not be blank").exists(), body("value", "value should not be blank").exists()], redeemtionLimit);
router.post("/CropTransaction", CropTransaction);
router.post("/GetCropDetails", GetCropDetails);
router.post("/PropTransaction", PropTransaction);
router.post("/GetPropDetails", GetAllProp);
router.post("/setBasePrice", setBasePrice);
router.post("/getBasePrice", getBasePrice);
router.post("/updateBasePrice", updateBasePrice);
router.post("/publishOffer", publishOffer);
router.post("/getAccountBalance", getAccountBalance);
router.post("/updateAccountBalance", updateAccountBalance);
// router.post("/updateTier", updateTier);
router.post("/saveAccountBalance", saveAccountBalance);
router.post("/getAllProduct", getAllProduct);
router.post("/createAudit", createAudit);
router.post("/getAuditReport", getAuditReport);
router.post("/createMilestoneData", createMilestoneData);
router.post("/getMilestoneData", getMilestoneData);
router.post("/updateMilestoneData", updateMilestoneData);
router.post("/getData", getData);
router.post("/updateData", updateData);
router.post("/createData", createData);
router.post("/createCustomerComplain", createCustomerComplain);
router.post("/getCustomerComplain", getCustomerComplain);
router.post("/updateCustomerComplaint", updateCustomerComplain);
router.post("/createBusinessComplain", createBusinessComplain);
router.post("/getBusinessComplain", getBusinessComplain);
router.post("/updateBusinessComplain", updateBusinessComplain);
router.post("/createCustomerRequest", createCustomerRequest);
router.post("/getCustomerRequest", getCustomerRequest);
router.post("/updateCustomerRequest", updateCustomerRequest);
router.post("/createBusinessRequest", createBusinessRequest);
router.post("/getBusinessRequest", getBusinessRequest);
router.post("/updateBusinessRequest", updateBusinessRequest);
router.post("/getBusinessSurvey", getBusinessSurvey);
router.post("/createBusinessSurvey", createBusinessSurvey);
router.post("/getCustomerSurvey", getCustomerSurvey);
router.post("/createCustomerSurvey", createCustomerSurvey);
router.post("/savePropValues", savePropValues);
router.post("/updateStoreProp", updateStoreProp);
router.post("/getPropValues", getPropValues);
router.post("/getAdminData", verifyToken, getAdminData);
router.post("/updateAdminUser", verifyToken, updateAdminUser);
router.post("/updateAdminUserPassword", verifyToken, updateAdminUserPassword);
router.post("/createNotification", createNotification);
router.post("/getAllNotifications", getAllNotifications);
router.post("/createBusinessAudit", createBusinessAudit);
router.post("/getBusinessAuditReport", getBusinessAuditReport);
router.post("/getAllCustomerProp", getAllCustomerProp);
router.post("/getAllCustomerCrop", getAllCustomerCrop);
router.post("/getAllBusinessCrop", getAllBusinessCrop);
router.post("/createCustomerInvoice", createCustomerInvoice);
router.post("/createBusinessInvoice", createBusinessInvoice);
router.post("/getAllBusinessInvoice", getAllBusinessInvoice);
router.post("/getAllCustomerInvoice", getAllCustomerInvoice);
router.post("/getPropValuation", getPropValuation);
router.post("/createPropValuation", createPropValuation);
router.post("/updatePropValuation", updatePropValuation);
router.post("/createCustomerAccountNotification", createCustomerAccountNotification);
router.post("/getCustomerAccountNotification", getCustomerAccountNotification);
router.post("/updateCustomerAccountNotification", updateCustomerAccountNotification);
router.post("/createCustomerGeneralNotification", createCustomerGeneralNotification);
router.post("/getCustomerGeneralNotification", getCustomerGeneralNotification);
router.post("/updateCustomerGenearlNotification", updateCustomerGenearlNotification);
router.post("/createCustomerGeneralNotification", createCustomerGeneralNotification);
router.post("/getCustomerGeneralNotification", getCustomerGeneralNotification);
router.post("/updateCustomerGenearlNotification", updateCustomerGenearlNotification);
router.post("/createCustomerPurchaseAndRedeemNotification", createCustomerPurchaseAndRedeemNotification);
router.post("/getCustomerPurchaseAndRedeemNotification", getCustomerPurchaseAndRedeemNotification);
router.post("/updateCustomerPurchaseAndRedeemNotification", updateCustomerPurchaseAndRedeemNotification);
router.post("/createCustomerRequestAndComplaintNotification", createCustomerRequestAndComplaintNotification);
router.post("/getCustomerRequestAndComplaintNotification", getCustomerRequestAndComplaintNotification);
router.post("/updateCustomerRequestAndComplaintNotification", updateCustomerRequestAndComplaintNotification);
router.post("/createBusinessAccountNotification", createBusinessAccountNotification);
router.post("/getBusinessAccountNotification", getBusinessAccountNotification);
router.post("/updateBusinessAccountNotification", updateBusinessAccountNotification);
router.post("/getBusinessGeneralNotification", getBusinessGeneralNotification);
router.post("/createBusinessGeneralNotification", createBusinessGeneralNotification);
router.post("/updateBusinessGenearlNotification", updateBusinessGenearlNotification);
router.post("/createBusinessPurchaseAndRedeemNotification", createBusinessPurchaseAndRedeemNotification);
router.post("/getBusinessPurchaseAndRedeemNotification", getBusinessPurchaseAndRedeemNotification);
router.post("/updateBusinessPurchaseAndRedeemNotification", updateBusinessPurchaseAndRedeemNotification);
router.post("/createBusinessRequestAndComplaintNotification", createBusinessRequestAndComplaintNotification);
router.post("/getBusinessRequestAndComplaintNotification", getBusinessRequestAndComplaintNotification);
router.post("/updateBusinessRequestAndComplaintNotification", updateBusinessRequestAndComplaintNotification);
// router.post("/paymentLink", paymentLink);
//customer data

router.post("/getAllCustomer", getAllCustomer)
router.post("/getAllOrders", getAllOrders)
router.post("/customerProp", verifyToken, customerProp)
router.post("/customerCrop", verifyToken, customerCrop)
router.post("/updateCustomerStatus", updateCustomerStatus)

//
//Business data

router.post("/getAllBusiness", getAllBusiness)
router.post("/businessCrop", verifyToken, businessCrop)
router.post("/updateBusinessAccountStatus", updateBusinessAccountStatus)
router.post("/createEveryDayPromotionSlot", createEveryDayPromotionSlot)
router.get("/getSlot", getSlot)
router.post('/getAllBusinessByContent', getAllBusinessByContent)
//admin update
const {sendMail, sendMassNotification}  = require("../controller/adminController/Notification/sendMail");
router.post("/sendMail", sendMail)
router.post("/sendMassNotification", sendMassNotification)
module.exports = router;
