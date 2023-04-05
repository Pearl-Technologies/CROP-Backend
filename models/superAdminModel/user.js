const mongoose = require("mongoose");
const admin = mongoose.model('Admin_admin', { 
    name: {type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    imageUrl:	{
      data: {type:Buffer, default:""}, 
      contentType: {type:String, default:""}
    },
    birthDate:{type:String, defalut:""},
    gender:{type:String, default:""},
    phone:{type:Number, default:null},
    invoiceCycle: {type:String, default: "N"},
    businessTier: {type:String, default: "N"},
    customerTier: {type:String, default: "N"},
    serviceRequest:{type:String, default: "N"},
    complaint:{type:String, default: "N"},
    orderRevocation: {type:String, default: "N"},
    survayDesign:{type:String, default: "N"},
    serviceChange:{type:String, default: "N"},
    notifications:{type:String, default: "N"},
    notificationsContent:{type:String, default: "N"},
    pricing:{type:String, default: "N"},
    subscription_frequencies:{type:String, default: "N"},
    earnPoint_valuation:{type:String, default: "N"},
    redeemPoint_valuation: {type:String, default: "N"},
    massNotifications:{type:String, default: "N"},
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = admin