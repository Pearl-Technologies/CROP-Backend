const mongoose = require("mongoose");
const adminCustomerAccountNotification = mongoose.model('Admin_customer_account_notification', { 
    first_time_notification:{type:String},
    subscription_renewal:{type:String},
    points_credit_against_spends:{type:String},
    points_credit_solical_media_posts:{type:String},
    points_expiry:{type:String},
    points_redeemed:{type:String},
    redeemtion_limit:{type:String},
    redeemtion_limit:{type:String},
    pin_change:{type:String},
    transfer_in:{type:String},
    date:{type:Date, default:Date.now},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
    },
 });
 
module.exports = adminCustomerAccountNotification