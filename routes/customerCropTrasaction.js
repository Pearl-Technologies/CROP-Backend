const express = require("express");
const router = express.Router();
const {getMyCropTrasaction, getEmailStatementMyCropTrasaction} = require("../controller/customerCropTransaction");
const {getMyPropTrasaction} = require("../controller/customerPropTransaction");

router.get("/getMyCropTrasaction", getMyCropTrasaction)
router.get("/getMyPropTrasaction", getMyPropTrasaction)
router.get('/getEmailStatementMyCropTrasaction', getEmailStatementMyCropTrasaction);
module.exports = router;