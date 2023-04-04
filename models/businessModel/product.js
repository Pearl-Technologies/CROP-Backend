const mongoose = require('mongoose');
const valid = require("validator");
// const Category = require("/Category.js");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  // sku: {
  //   type: String,
  //   required: false,
  // },
  // parent: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  children: {
    type: String,
    required: true,
    trim: true,
  },
  // tags: [Array],
  image: {
    type: String,
    required: true,
    validate: [valid.isURL, "wrong url"]
  },
  originalPrice: {
    type: Number,
    required: true,
    min: [0, "Price can't be negative"],
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: [0, "Price can't be negative"],
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
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
    default: 0
  },

  apply: { type: String, required: true },
  availDate: {
    fromDate: { type: Date },
    toDate: { type: Date },
  },
  // type: String,
  itemInfo: String,
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inActive'],
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
  // categoryId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Category'
  // },
  // subCategoryId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'subcategory'
  // }
}, {
  timestamps: true
})

const Product = mongoose.model('business_products', productSchema);
module.exports = { Product };