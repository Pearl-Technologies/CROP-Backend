const mongoose = require('mongoose');
const valid = require("validator");
// const Category = require("/Category.js");

const productSchema = mongoose.Schema({
  croppoints:{
    type:Number,
  },
  sku: {
    type: String,
    required: false,
  },
  title:{
    type:String,
    required:true,
    trim: true,
  },
  parent:{
    type:String,
    required: true,
    trim:true,
  },
  children:{
    type:String,
    required: true,
    trim:true,
  },
  tags: [Array],
  image:{
    type:String,
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
  relatedImages: [{
    type: String,
    required: true,
    validate: [valid.isURL, "wrong url"]
  }],
  description: {
    type: String,
    required: true,
    trim: true,
  },
  brand:{
    type:String,
    required:true,
  },
  unit: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  croppoints: {
    type: Number,
    default:"null"
  },
  colors:[Array],
  type:String,
  itemInfo:String,
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inActive'],
  },
  // category: {
  //   type: Schema.Types.ObjectId,
  //   ref: Category
  // }
},{
  timestamps: true
})

const Product = mongoose.model('products_customer',productSchema);
module.exports = {Product};