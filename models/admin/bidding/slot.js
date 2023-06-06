
const mongoose = require("mongoose");
const slot = mongoose.model("Admin_slot", {
  publishingSlot:{type:String, require:true},
  publishedAs:{type:String, required:true},
  bid_end_date: {  type: String, required:true },
  published_start_date: {  type: String, required:true },
  published_end_date: {  type: String, required:true },
});
module.exports = slot;
