const express = require("express");
const {
  addCategory,
  getShowingCategory,
  addAllCategory,
  getEarnCategory,
  getRedeemCategory
} = require("../controller/categoryController");

const router = express.Router();

//add a category
router.post("/add", addCategory);
//add all category
router.post("/add-all", addAllCategory);
//get only showing category
router.get("/show", getShowingCategory);
router.get("/earn", getEarnCategory);
router.get("/redeem", getRedeemCategory);

module.exports = router;
