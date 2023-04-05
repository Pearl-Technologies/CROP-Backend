const mongoose = require("mongoose");
const adminCustomerInvoice = mongoose.model('admin_customer_invoice', { 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users_customer",
  },
    invoiceNumber: {type:String, required:true, unique:true},
    orderNumber: {type:String, required: true, unique:true},
    otp: {type:Number},
    promoCode: {type:String},
    invoiceDesecription: {type:String, required:true}, 
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = adminCustomerInvoice