const mongoose = require('mongoose');
const valid = require("validator");
// const Category = require("/Category.js");

const cartSchema = mongoose.Schema({

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  cart: [{}],
  statuscode: {
    type: Number,
    required: true,
  },
 
  // user_id:{
  //   type:Number
  // },
  // item_count:{
  //   type:Number
  // },
  //   status: {
  //   type: String,
  //   default: 'active',
  //   enum: ['active', 'inActive'],
  // },
},{
  timestamps: true
})

const Cart = mongoose.model('carts_customer',cartSchema);
module.exports = {Cart};