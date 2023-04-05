const mongoose = require("mongoose");
const adminBusinessGeneralNotification = mongoose.model('Admin_business_general_notification', { 
    confirmation_of_booked_promos:{type:String},
    CROP_promos:{type:String},
    upload_and_removal_of_offer :{type:String},
    business_insights :{type:String},
    date:{type:Date, default:Date.now},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
    },
 });
 
module.exports = adminBusinessGeneralNotification