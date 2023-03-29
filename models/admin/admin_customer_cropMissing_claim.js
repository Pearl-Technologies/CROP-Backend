const mongoose = require("mongoose");
const adminCustomerCropMissingClaim = mongoose.model('admin_customer_crop_missing_claim', { 
    businessName:{type:String, required:true},
    invoiceDate:{type:Date, default:Date.now},
    issue_narrative:{type:String, required:true},
    invoiceNumber:{type:String, required:true},
    referenceNumber:{type:String, required:true},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users_customers",
    },
 });
 

module.exports = adminCustomerCropMissingClaim