const mongoose = require("mongoose");
const businessProp = mongoose.model('Business_Prop', { 
    credit: {type:Number},
    debit: {type:Number},
    description:{type:String, required:true},  
    propId: {
      type: mongoose.Schema.Types.Number,
      ref: "business",
    },   
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = businessProp