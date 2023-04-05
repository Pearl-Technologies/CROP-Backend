const mongoose = require("mongoose");
const adminCustomerPurchaseAndRedeemtionNotification = mongoose.model('Admin_customer_purchaseAndRedeemtion_notification', { 
    offers_purchased:{type:String},
    offers_redeemed:{type:String},
    points_purchased:{type:String},
    payment_notifications:{type:String},
    e_vouchers:{type:String},
    date:{type:Date, default:Date.now},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
    },
 });
 
module.exports = adminCustomerPurchaseAndRedeemtionNotification