const express = require("express");
const router = express.Router();
const {getMyCropTrasaction} = require("../controller/customerCropTransaction");

router.get("/getMyCropTrasaction", getMyCropTrasaction)
module.exports = router;