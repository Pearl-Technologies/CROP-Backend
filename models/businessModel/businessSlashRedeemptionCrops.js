const mongoose = require("mongoose");

const businessSlashRedemptionCrops = mongoose.model('Business_SlashRedemptionCrops', { 
    slashRedemption: {
        fromDate: {type: Date},
        toDate: {type: Date}
    },
    slashRedemptionDays: {
        sun: {type: Boolean, default: false},
        mon: {type: Boolean, default: false},
        tue: {type: Boolean, default: false},
        wed: {type: Boolean, default: false},
        thu: {type: Boolean, default: false},
        fri: {type: Boolean, default: false},
        sat: {type: Boolean, default: false},
    },
    slashRedemptionPercentage: {type: Number},
    slashRedemptionProducts: [{productId: mongoose.Schema.Types.ObjectId, productName: String}],
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
    }
 });


module.exports = businessSlashRedemptionCrops