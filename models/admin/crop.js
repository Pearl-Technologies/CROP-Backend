const mongoose = require("mongoose");
const crop = mongoose.model('Admin_Crop', { 
    credit: {type:Number },
    debit: {type:Number},
    description:{type:String, required:true},
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = crop