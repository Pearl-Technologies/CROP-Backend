const mongoose = require("mongoose");
const adminBusinessRequestAndComplainNotification = mongoose.model('Admin_business_request_and_complain_notification', { 
    missing_points_claim:{type:String},
    complaint:{type:String},
    request  :{type:String},
    auto_generated_service_requests:{type:String},
    date:{type:Date, default:Date.now},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
    },
 });
 
module.exports = adminBusinessRequestAndComplainNotification