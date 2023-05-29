const mongoose = require("mongoose");
const adminBusinessGeneralNotification = mongoose.model('Admin_business_general_notification', { 
    confirmation_of_booked_promos:String,
    CROP_promos:String,
    upload_and_removal_of_offer:String,
    business_insights:String ,      
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
    },
    date:{type:Date, default:Date.now},   
 });
 
module.exports = adminBusinessGeneralNotification