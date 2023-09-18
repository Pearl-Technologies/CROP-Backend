const mongoose = require("mongoose");
const adminCustomerComplain = mongoose.model('Admin_customer_complain', { 
    description:{type:String, required:true},
    expectedOutcoms:{type:String, required:true},
    complainType:{type:String, required:true},
    preferredMediumContact:{type:String, required:true},
    complainNumber:{type:String, required:true},
    complainStatus:{type:String, default:"open"},
    complainUpdateDate:{type:Date, default:Date.now},
    complainResponse:{type:String, default:""},
    createdAt:{type:Date, default:Date.now},   
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users_customers",
    },
    handler:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin_admin",
    }
 });
 

module.exports = adminCustomerComplain