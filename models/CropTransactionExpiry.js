const mongoose = require("mongoose")
const customerCropTransactionExpiry = mongoose.model("crop_transactions_expiry", {
orderNumber:{type:String, require:true},
transactionType:{type:String, require:true},
crop:{type:Number, require:true},
usedCrop:{type:Number, default:0},
expired:{type:Boolean, default:false },
amount:{type:Number, required:true},
description:{type:String},
invoiceNumber:{type:String},
invoiceUrl:{type:String},
invoicePdf:{type:String},
user:{type:mongoose.Schema.Types.ObjectId, ref:"user_customer", required:true},
createdAt:{type:Date, default:Date.now()}
})

module.exports = customerCropTransactionExpiry
