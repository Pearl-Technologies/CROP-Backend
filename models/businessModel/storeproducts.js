const mongoose = require("mongoose")
const valid = require("validator")
// const Category = require("/Category.js");

const storeProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: [],
      default: [],
    },
    redeemProps: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    availDate: {
      fromDate: { type: String },
      toDate: { type: String },
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inActive", "published"],
    },
    customiseMsg: { type: String, required: true },
    slot: { type: String },
    mktOfferFor: { type: String, default: "" },
    mktDate: {
      fromDate: { type: String },
      toDate: { type: String },
    },
    bidDate: {
      fromDate: { type: String },
      toDate: { type: String },
    },
    bidPrice: { type: Number, default: 0 },
    bid: { type: Boolean, default: false },
    market: { type: Boolean, default: false },
    city: { type: String },
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
    },
  },
  {
    timestamps: true,
  }
)

const StoreProduct = mongoose.model(
  "business_store_products",
  storeProductSchema
)
module.exports = { StoreProduct }
