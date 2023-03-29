const mongoose = require("mongoose");
const adminAudit = mongoose.model('Admin_Audit', { 
    date:{type:Date, default:Date.now},
    description:{type:String, required:true},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users_customers",
    },
 });
 

module.exports = adminAudit