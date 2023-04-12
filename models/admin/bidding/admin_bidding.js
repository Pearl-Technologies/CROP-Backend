const mongoose = require("mongoose");
const bidding = mongoose.model("Admin_bidding", {
  publishingSlot:{type:String, require:true},
  publishedAs:{type:String, required:true},
  bid_start_date: { type: String, required:true },
  bid_end_date: {  type: String, required:true },
  published_start_date: {  type: String, required:true },
  published_end_date: {  type: String, required:true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "business" }
});

module.exports = bidding;
