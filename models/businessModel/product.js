const mongoose = require('mongoose');
const valid = require("validator");
// const Category = require("/Category.js");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // parent: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    // children: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    // tags: [Array],
    images: {
      type: [],
      default: [],
    },
    originalPrice: {
      type: Number,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    croppoints: {
      type: Number,
      default: 0,
    },
    redeemCROPs: {
      type: Number,
    },
    apply: { type: String, required: true },
    availDate: {
      fromDate: { type: String },
      toDate: { type: String },
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inActive"],
    },
    customiseMsg: { type: String, required: true },
    mktOfferFor: { type: String, default: "" },
    bidPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
    },
    sector: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model("business_products", productSchema)
module.exports = { Product };