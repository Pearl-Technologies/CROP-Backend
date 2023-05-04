const mongoose = require("mongoose");
const adminCustomerAudit = mongoose.model('Admin_customer_audit', { 
    date:{type:Date, default:Date.now},
    description:{type:String, required:true},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users_customers",
    },
 });
 

module.exports = adminCustomerAudit