const mongoose = require("mongoose");

const businessCropRules = mongoose.model('Business_CropRules', { 
    cropPerAudCredit: {type: Number, default: 1},  
    cropPerAudDebit: {type: Number, default: 1},  
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
    }
 });


module.exports = businessCropRules