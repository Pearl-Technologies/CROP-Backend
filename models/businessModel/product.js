const mongoose = require('mongoose');
const valid = require("validator");
// const Category = require("/Category.js");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sector: { type: String, required: true },
    image: {
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

const Product = mongoose.model("business_products", productSchema)

const productCommentSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users_customer",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: String, default: null },
  },
  {
    timestamps: true,
  }
)

const productComment = mongoose.model("products_comments", productCommentSchema)

module.exports = { Product, productComment }
