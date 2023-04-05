const mongoose = require("mongoose");
const adminGeneralAccountNotification = mongoose.model('Admin_customer_general_notification', { 
    business_promos:{type:String},
    CROP_promos:{type:String},
    offers:{type:String},
    bonus_points:{type:String},
    get_a_mate:{type:String},
    date:{type:Date, default:Date.now},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
    },
 });
 
module.exports = adminGeneralAccountNotification