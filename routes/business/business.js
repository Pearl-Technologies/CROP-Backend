const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {getAllBusinessCrop, getAllBusinessProp, saveBusinessCrop, saveBusinessProp, registrationOTP, verifyBusiness, resendOtp, getProfile} = require("../../controller/businessController/business.js")
const {createOffer, updateOffer, getAlloffers, removeOffer} = require("../../controller/businessController/product")
const {BusinessLogin, createBusinessUser, getAllBusiness} = require("../../controller/businessController/business");

const authorization = require("../../middleware/verifyToken");
const { createServices, getService } = require("../../controller/businessController/services");
const { createOrUpdateCropRules, getCropRules, createOrUpdateExtendBonusCrops, getExtendBonusCrops, createOrUpdateSlashRedeemptionCrops, getSlashRedemptionCrop, createOrUpdateHappyHours, getHappyHours } = require("../../controller/businessController/crop");

// const { customerLogin, createCustomer, getAllCustomer } = require("../controller/customerController/customer");

router.post('/emailphone', registrationOTP)
router.post('/emailphoneverify', verifyBusiness);
router.post('/resendotp', resendOtp);
router.post("/businessSignup", createBusinessUser);

router.post("/businessLogin", BusinessLogin);
router.get("/get-profile", authorization, getProfile)

router.post("/getAllBusiness", getAllBusiness);
router.post("/getAllBusinessCrop", getAllBusinessCrop);
router.post("/getAllBusinessProp", getAllBusinessProp);
router.post("/saveCrop", saveBusinessCrop);
router.post("/saveProp", saveBusinessProp);
// router.post("/createOffer", createOffer);
// router.post("/updateOffer", updateOffer);
// router.post("/getAllOffers", getAlloffers);
// router.post("/removeOffer",  removeOffer);

router.post("/services", authorization, createServices);
router.get("/services", authorization, getService);

router.get("/extend-crop-bonus", authorization, getExtendBonusCrops);
router.post("/extend-crop-bonus", authorization, createOrUpdateExtendBonusCrops);

router.post("/crop-rules", authorization, createOrUpdateCropRules);
router.get("/crop-rules", authorization, getCropRules);

router.post("/slash-redemption-crop", authorization, createOrUpdateSlashRedeemptionCrops);
router.get("/slash-redemption-crop", authorization, getSlashRedemptionCrop);

router.post("/happy-hours", authorization, createOrUpdateHappyHours);
router.get("/happy-hours", authorization, getHappyHours);

module.exports = router;


