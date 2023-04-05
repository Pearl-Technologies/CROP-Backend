const basePrice = require("../../models/admin/basePrice");
const { validationResult } = require("express-validator");

const setBasePrice = async (req, res) => {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const { weekday, weekend, publicHoliday, weekly, monthly, top_offers, 
      top_promo,
      top_storeOffer,
      massNotification,
      surveyDesign,
      earnCropValuation,
      earnPropValuation,
      redeemCropValuation,
      redeemPropValuation,
      purchasePropValuation, user } = req.body;
      // const user = req.user.user.id
    //create a new user
    let findBasePrice = await basePrice.find({});

    if (findBasePrice.length) {
      return res.status(400).json({ success: false, message: "base price is already exist plese update" });
    }
    await basePrice.create({
      weekday, 
      weekend, 
      publicHoliday,
      weekly,
      monthly,
      top_offers,
      top_promo,
      top_storeOffer,
      massNotification,
      surveyDesign,
      earnCropValuation,
      earnPropValuation,
      redeemCropValuation,
      redeemPropValuation,
      purchasePropValuation,
      user
    });

    res.json({ success: true, message: "base price created" });
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Some Error Occured");
  }
};
const getBasePrice = async (req, res) => {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    let findBasePrice = await basePrice.find();
    res.json({ success: true, defaultPrice:findBasePrice });
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Some Error Occured");
  }
};
const updateBasePrice = async (req, res) => {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  console.log(req.body);

  try {
    const { _id, weekday, weekend, publicHoliday, weekly, monthly, top_offers, top_promo, top_storeOffer, massNotification, surveyDesign, earnCropValuation, earnPropValuation, redeemCropValuation, redeemPropValuation, purchasePropValuation, user } = req.body;
    // let user = req.user.user.id;
    
    let findBasePrice = await basePrice.findOne({_id});
  
    if (!findBasePrice) {
      return res.status(400).json({ success: false, message: "base price is not exist plese set One" });
    }
    const newData = {};
    if (weekday) {
      newData.weekday = weekday;
    }
    if (weekend) {
      newData.weekend = weekend;
    }
    if (publicHoliday) {
      newData.publicHoliday = publicHoliday;
    }
    if (weekly) {
      newData.weekly = weekly;
    }
    if (monthly) {
      newData.monthly = monthly;
    }
    if (top_offers) {
      newData.top_offers = top_offers;
    }
    if (top_promo) {
      newData.top_promo = top_promo;
    }
    if (top_storeOffer) {
      newData.top_storeOffer = top_storeOffer;
    }
    if (massNotification) {
      newData.massNotification = massNotification;
    }
    if (surveyDesign) {
      newData.surveyDesign = surveyDesign;
    }
    if (earnCropValuation) {
      newData.earnCropValuation = earnCropValuation;
    }
    if (earnPropValuation) {
      newData.earnPropValuation = earnPropValuation;
    }
    if (redeemCropValuation) {
      newData.redeemCropValuation = redeemCropValuation;
    }
    if (redeemPropValuation) {
      newData.redeemPropValuation = redeemPropValuation;
    }
    if (purchasePropValuation) {
      newData.purchasePropValuation = purchasePropValuation;
    }

    if(findBasePrice.user.toString() !== user){
      return res.send({ success: false, message: "you are not authorize" });  
    };
    let updateData = await basePrice.findByIdAndUpdate({ _id }, { $set: newData }, { new: true });
    if(updateData){
      res.json({ success: true, message: "Base Price Updated" });
    }else{
      res.json({ success: false, message: "Base Price not updated" });
    }
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Some Error Occured");
  }
};

module.exports = { setBasePrice, getBasePrice, updateBasePrice };
