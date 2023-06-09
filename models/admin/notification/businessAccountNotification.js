const mongoose = require("mongoose");
const adminBusinessAccountNotification = mongoose.model('Admin_business_account_notification', { 
    first_time_subscription:{type:String},
    subscription_renewal:{type:String},
    points_transaction :{type:String},
    sales :{type:String},
    point_offered_against_spends:{type:String},
    point_offered_surveys_completed:{type:String},
    point_Offered_social_media:{type:String},
    base_threshold_limit:{type:String},
    pin_change:{type:String},
    program_change_Offer_points:{type:String},
    program_change_redemption :{type:String},
    program_change_bonus_points:{type:String},
    program_change_slash_redeemption_changes:{type:String},
    transfer_out:{type:String},
    statement_generation:{type:String},
    date:{type:Date, default:Date.now},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
    },
 });
 
module.exports = adminBusinessAccountNotification