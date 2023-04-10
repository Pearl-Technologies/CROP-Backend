const mongoose = require("mongoose");
// Below Commented Things Relied Only on {type, desc}
// First time subcription
// Subcription Renewal
// Pin Change
// Program Change
const accountNotificationSchema = mongoose.Schema({ 
    type:{type:String, required: true},
    desc:{type:String, required:true},    
    businessId: { type: mongoose.Schema.Types.ObjectId, required: true },
    pointsTransaction: {
        givenCrops: String,
        redeemedCrops: String,
        totalCrops: String
    },
    sales: {
        totalProducts: {type: Number},
        totalAmount: {type: Number}
    },
    pointsOffered: {
        type: String,
        crops: Number
    },
    // baseThresholdLimit: {}
    transfer: {
        type: { type: String },
        crops: {type: Number}
    },
    statementGeneration: {
        statementId: {type: mongoose.Schema.Types.ObjectId}
    },
    readed: {type: Boolean, default: false}
}, {
     timestamps: true
 });

 const accountNotification = mongoose.model('business_account_notification', accountNotificationSchema)

module.exports = accountNotification