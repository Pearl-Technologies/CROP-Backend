const express = require("express");
const chatControl = require("../controller/chatController");

const router = express.Router();

router.get("/chat",chatControl);

module.exports=router;


