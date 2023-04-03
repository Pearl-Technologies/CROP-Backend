const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");
const {
  adminLogin,
  adminPasswordReset,
  getAdminData,
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
// const { getAllProducts } = require("../controller/businessController/product");
const {
  createAudit,
  getAuditReport,
} = require("../controller/adminController/audit");
const {
  createMilestoneData,
  getMilestoneData,
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
const updateAdminUser = require("../controller/adminController/admin_update_user");

//customer 
const {getAllCustomer, getAllOrders} =require("../controller/adminController/CustomerData/customer");

//

//Business
const {getAllBusiness} = require("../controller/adminController/BusinessData/business");
//
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


let upload = multer({ storage, fileFilter });
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
router.post("/setBasePrice", verifyToken, setBasePrice);
router.post("/getBasePrice", getBasePrice);
router.post("/updateBasePrice", verifyToken, updateBasePrice);
router.post("/publishOffer", publishOffer);
router.post("/getAccountBalance", getAccountBalance);
router.post("/updateAccountBalance", updateAccountBalance);
// router.post("/updateTier", updateTier);
router.post("/saveAccountBalance", saveAccountBalance);
// router.post("/getAllProducts", getAllProducts);
router.post("/createAudit", createAudit);
router.post("/getAuditReport", getAuditReport);
router.post("/createMilestoneData", createMilestoneData);
router.post("/getMilestoneData", getMilestoneData);
router.post("/getData", getData);
router.post("/updateData", updateData);
router.post("/createData", createData);
router.post("/createCustomerComplain", createCustomerComplain);
router.post("/getCustomerComplain", getCustomerComplain);
router.post("/updateCustomerComplain", updateCustomerComplain);
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
// router.post("/updateAdminUser", verifyToken, updateAdminUser);
// router.route("/updateAdminUser"). post(upload.single('photo'), verifyToken, updateAdminUser);
router.post("/getAdminData", verifyToken, getAdminData);
//customer data
router.post("/getAllCustomer", getAllCustomer)
router.post("/getAllOrders", getAllOrders)
//
//Business data

router.post("/getAllBusiness", getAllBusiness)


module.exports = router;
