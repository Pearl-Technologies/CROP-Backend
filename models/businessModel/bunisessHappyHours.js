const mongoose = require("mongoose");

const businessHappyHours = mongoose.model('Business_HappyHours', { 
    happyHoursDates: {
        fromDate: {type: Date},
        toDate: {type: Date}
    },
    happryHoursTime: {
        startHours: {type: String},
        endHours: {type: String},
    },
    happyHoursDays: {
        sun: {type: Boolean, default: false},
        mon: {type: Boolean, default: false},
        tue: {type: Boolean, default: false},
        wed: {type: Boolean, default: false},
        thu: {type: Boolean, default: false},
        fri: {type: Boolean, default: false},
        sat: {type: Boolean, default: false},
    },
    happyHoursPercentage: {type: Number},
    happyHoursProducts: [{productId: mongoose.Schema.Types.ObjectId, productName: String}],
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
    }
 });


module.exports = businessHappyHours