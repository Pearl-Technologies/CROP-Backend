const mongoose = require("mongoose");
const invoice = mongoose.model('Business_Invoice', { 
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "business",
  },
    invoiceNumber: {type:String, required:true},
    orderNumber: {type:String, required: true},
    otp: {type:Number},
    promoCode: {type:Number},
    invoiceDesecription: {type:Number, required:true}, 
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = invoice