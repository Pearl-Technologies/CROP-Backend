const mongoose = require("mongoose");
const adminCustomerRequestAndComplainedNotification = mongoose.model('Admin_customer_requestAndComplained_notification', { 
    missing_points_claim:{type:String},
    offers_redeemed:{type:String},
    complaint :{type:String},
    request :{type:String},
    rate_your_experience:{type:String},
    date:{type:Date, default:Date.now},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
    },
 });
 
module.exports = adminCustomerRequestAndComplainedNotification