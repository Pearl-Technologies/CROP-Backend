const mongoose = require("mongoose");

const businessBonusCrops = mongoose.model("Business_BonusCrops", {
  bonusCrop: {
    fromDate: { type: String },
    toDate: { type: String },
  },
  bonusCropDays: {
    all: { type: Boolean, default: false },
    sun: { type: Boolean, default: false },
    mon: { type: Boolean, default: false },
    tue: { type: Boolean, default: false },
    wed: { type: Boolean, default: false },
    thu: { type: Boolean, default: false },
    fri: { type: Boolean, default: false },
    sat: { type: Boolean, default: false },
  },
  bonusCropPercentage: { type: Number },
  bonusCropProducts: [
    { productId: mongoose.Schema.Types.ObjectId, productName: String },
  ],
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "business",
  },
})


module.exports = businessBonusCrops