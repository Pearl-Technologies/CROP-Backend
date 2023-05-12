const express = require("express");
const router = express.Router();
const {getMyCropTrasaction, getEmailStatementMyCropTrasaction, getMyCropTrasactionForDownloadStatement} = require("../controller/customerCropTransaction");
const {getMyPropTrasaction} = require("../controller/customerPropTransaction");

router.get("/getMyCropTrasaction", getMyCropTrasaction)
router.get("/getMyPropTrasaction", getMyPropTrasaction)
router.get('/getEmailStatementMyCropTrasaction', getEmailStatementMyCropTrasaction);
router.get('/getMyCropTrasactionForDownloadStatement', getMyCropTrasactionForDownloadStatement);
module.exports = router;