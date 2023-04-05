const mongoose = require("mongoose");
const adminBusinessInvoice = mongoose.model('admin_business_invoice', { 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "business",
  },
    invoiceNumber: {type:String, required:true, unique:true},
    orderNumber: {type:String, required: true, unique:true},
    otp: {type:Number},
    promoCode: {type:String, unique:true},
    invoiceDesecription: {type:String, required:true}, 
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = adminBusinessInvoice