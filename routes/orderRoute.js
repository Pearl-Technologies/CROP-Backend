const express = require("express");
const { paymentIntent, addOrder } = require("../controller/orderController");

// router
const router = express.Router();

// add a create payment intent
router.post("/create-payment-intent", paymentIntent);
router.put("/addOrder", addOrder);

module.exports = router;
