const express = require("express");
const { paymentIntent, addOrder, RedeemCrop } = require("../controller/orderController");

// router
const router = express.Router();

// add a create payment intent
router.post("/create-payment-intent", paymentIntent);
router.put("/addOrder", addOrder);
router.post("/createRedeemCropIntent", RedeemCrop)
module.exports = router;
