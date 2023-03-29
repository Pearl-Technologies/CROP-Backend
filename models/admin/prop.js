const mongoose = require("mongoose");
const prop = mongoose.model('Admin_Prop', { 
    credit: {type:Number},
    debit: {type:Number},
    description:{type:String, required:true},       
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = prop