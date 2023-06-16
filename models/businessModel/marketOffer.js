const mongoose = require("mongoose")

const businessMarketOfferShema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business_products",
    },
    marketOfferFor: { type: String, required: true },
    slot: { type: String },
    bidDate: {
      fromDate: { type: String },
      toDate: { type: String },
    },
    marketDate: {
      fromDate: { type: String },
      toDate: { type: String },
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
    },
    bidPrice: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    market: { type: Boolean, default: false },
    bid: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const businessMarketOffer = mongoose.model(
  "business_market_offer",
  businessMarketOfferShema
)

module.exports = businessMarketOffer
