const mongoose = require("mongoose");
const vouchers = mongoose.model('admin_vouchers', { 
    orderNumber:String,
    invoiceNumber:{type:String},
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    createdAt:{type:Date, default:Date.now()}
 });

module.exports = vouchers