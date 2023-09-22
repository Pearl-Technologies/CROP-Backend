const mongoose = require("mongoose");
const basePrice = mongoose.model("Admin_basePrice", {
  weekday: { type: Number, default:0 },
  weekend: { type: Number, default:0 },
  publicHoliday: { type: Number, default:0 },
  weekly: { type: Number, default:0 },
  monthly: { type: Number, default:0 },
  top_offers:{ type: Number, default:0 },
  top_promo:{ type: Number, default:0 },
  top_storeOffer:{ type: Number, default:0 },
  massNotification:{ type: Number, default:0 },
  surveyDesign:{ type: Number, default:0 },
  earnCropValuation:{ type: Number, default:0 },
  redeemCropValuation:{ type: Number, default:0 },
  earnPropValuation:{ type: Number, default:0 },
  redeemPropValuation:{ type: Number, default:0 },
  local:{ type: Number, default:0 },
  regional:{ type: Number, default:0 },
  national:{ type: Number, default:0 },
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
