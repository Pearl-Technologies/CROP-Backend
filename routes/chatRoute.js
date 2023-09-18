const express = require("express");
const chatControl = require("../controller/chatController");
const verifyToken = require("../middleware/verifyToken");
const { availTags, checkAvailTags } = require("../middleware/availTags");
const { chatTrainModel, getTrainedFeedback, updateChatModel, updateResponseText, 
    feedbackTrainedModel, findForeignKey, getFeedbackHistory, deleteTrainModel, getUserTrainedFeedback, getAdminAction } = require("../controller/chatTrainModel");

const router = express.Router();

router.get("/chat",chatControl);
router.post("/chatTrain",chatTrainModel);
router.get("/getFeedbackChat",getTrainedFeedback);
router.post("/getUserFeedbackChat",verifyToken,availTags,getUserTrainedFeedback);
router.put("/updateFeedbackChat/:id",updateChatModel);
router.put("/updateTrainedRequest/:id",feedbackTrainedModel);
router.get("/findId",findForeignKey);
router.put("/updateResText/:id",updateResponseText);
router.get("/getFeedbackHistory/:id",getFeedbackHistory);
router.delete("/deleteFeedbackChat/:id",deleteTrainModel);
router.get("/getAdminActionData",getAdminAction);

module.exports=router;


