const mongoose = require("mongoose");
const vouchers = mongoose.model('admin_vouchers', { 
    image:{type:Date, default:Date.now},
    orderNumber:String,
    code:String,
    invoiceNumber:{type:String},
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
 });

module.exports = vouchers