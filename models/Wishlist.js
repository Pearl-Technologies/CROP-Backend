const mongoose = require('mongoose');
const valid = require("validator");
// const Category = require("/Category.js");

const wishlistSchema = mongoose.Schema({

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_customers",
    required: true,
  },

  Wishlist: [{}],
 
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

const Wishlist = mongoose.model('wishlists_customer',wishlistSchema);
module.exports = {Wishlist};