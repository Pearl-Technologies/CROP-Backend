const mongoose = require("mongoose");
const basePrice = mongoose.model("Admin_basePrice", {
  weekday: { type: Number, required: true },
  weekend: { type: Number, required: true },
  publicHoliday: { type: Number, required: true },
  weekly: { type: Number, required: true },
  monthly: { type: Number, required: true },
  top_offers:{ type: Number, required: true },
  top_promo:{ type: Number, required: true },
  top_storeOffer:{ type: Number, required: true },
  massNotification:{ type: Number, required: true },
  surveyDesign:{ type: Number, required: true },
  earnCropValuation:{ type: Number, required: true },
  redeemCropValuation:{ type: Number, required: true },
  earnPropValuation:{ type: Number, required: true },
  redeemPropValuation:{ type: Number, required: true },
  purchasePropValuation:{
    Prop:Number,
    AUDValue:Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin_user",
  },
  createAt: { type: Date, default: Date.now }

});

module.exports = basePrice;
