const mongoose = require("mongoose");
const loyalityProgrammeList = mongoose.model('admin_loyaltyProgrammeList', { 
    programmeName:{type:String, require:true},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
      required:true
    },
 });
 

module.exports = loyalityProgrammeList