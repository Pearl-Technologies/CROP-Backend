const mongoose = require("mongoose");
const adminBusinessAudit = mongoose.model('Admin_busin_audit', { 
    date:{type:Date, default:Date.now},
    description:{type:String, required:true},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "businesses",
    },
 });
 

module.exports = adminBusinessAudit