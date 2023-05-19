const express = require("express");
const router = express.Router();
const {getMyCropTrasaction, getEmailStatementMyCropTrasaction, getMyCropTrasactionForDownloadStatement} = require("../controller/customerCropTransaction");
const {getMyPropTrasaction, getEmailStatementMyPropTrasaction, getMyPropTrasactionForDownloadStatement} = require("../controller/customerPropTransaction");

router.get("/getMyCropTrasaction", getMyCropTrasaction)
router.get("/getMyPropTrasaction", getMyPropTrasaction)
router.get('/getEmailStatementMyCropTrasaction', getEmailStatementMyCropTrasaction);
router.get('/getMyCropTrasactionForDownloadStatement', getMyCropTrasactionForDownloadStatement);
router.get('/getEmailStatementMyPropTrasaction', getEmailStatementMyPropTrasaction);
router.get('/getMyPropTrasactionForDownloadStatement', getMyPropTrasactionForDownloadStatement);
module.exports = router;