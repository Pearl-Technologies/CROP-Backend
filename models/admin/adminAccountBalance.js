const mongoose = require("mongoose");
const AccountBalance = mongoose.model('Admin_AccountBalance', { 
    crop:{type:Number},
    prop:{type:Number},
    description:{type:String, required:true},       
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin_user",
    },
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });
 

module.exports = AccountBalance