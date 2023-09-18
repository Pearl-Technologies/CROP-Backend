const mongoose = require("mongoose");
const adminBusinessComplain = mongoose.model('Admin_business_complain', { 
  description:{type:String, required:true},
  expectedOutcoms:{type:String, required:true},
  complainType:{type:String, required:true},
  preferredMediumContact:{type:String, required:true},
  complainNumber:{type:String, required:true},
  complainStatus:{type:String, default:"received"},
  complainUpdateDate:{type:Date, default:Date.now},
  complainResponse:{type:String, default:""},
  createdAt:{type:Date, default:Date.now},
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business_user",
    },
    handler:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin_admin",
    }
 });
 

module.exports = adminBusinessComplain