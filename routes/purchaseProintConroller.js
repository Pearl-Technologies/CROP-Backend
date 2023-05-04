const express = require("express");
const {purchaseRequest } = require("../controller/royaltyController");

// router
const router = express.Router();

// add a create payment intent
router.post("/purchaseRequest", purchaseRequest);
module.exports = router;