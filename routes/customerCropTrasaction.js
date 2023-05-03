const express = require("express");
const router = express.Router();
const {getMyCropTrasaction} = require("../controller/customerCropTransaction");
const {getMyPropTrasaction} = require("../controller/customerPropTransaction");

router.get("/getMyCropTrasaction", getMyCropTrasaction)
router.get("/getMyPropTrasaction", getMyPropTrasaction)
module.exports = router;