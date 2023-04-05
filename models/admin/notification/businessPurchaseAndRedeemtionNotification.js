const mongoose = require("mongoose");
const adminBusinessPurchaseAndRedeemtionNotification = mongoose.model('Admin_business_purchase_and_redeemtion_notification', { 
    payment_notification:{type:String},
    order_notification_for_purchase:{type:String},
    redeemption_notification :{type:String},
    order_notification_for_redeemption :{type:String},
    date:{type:Date, default:Date.now},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
    },
 });
 
module.exports = adminBusinessPurchaseAndRedeemtionNotification