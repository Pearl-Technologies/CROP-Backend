const mongoose = require("mongoose");
const businessCrop = mongoose.model('Business_Crop', { 
    credit: {type:Number },
    debit: {type:Number},
    description:{type:String, required:true},    
    cropId: {
      type: mongoose.Schema.Types.String,
      ref: "business",
    },
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = businessCrop