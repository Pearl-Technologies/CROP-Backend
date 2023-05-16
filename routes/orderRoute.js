const express = require("express");
const { paymentIntent, addOrder, RedeemCrop, RedeemProp, pointPurchaseTrasaction, productPurchaseTrasaction } = require("../controller/orderController");
const verifyToken =require('../middleware/verifyToken')
// router
const router = express.Router();

// add a create payment intent
router.post("/create-payment-intent", paymentIntent);
router.put("/addOrder", addOrder);
router.post("/createRedeemCropIntent", RedeemCrop)
router.post("/createRedeemPropIntent", RedeemProp)
router.get("/pointPurchaseTrasaction", pointPurchaseTrasaction)
router.get("/productPurchaseTrasaction", productPurchaseTrasaction)
module.exports = router;
