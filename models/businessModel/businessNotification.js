const mongoose = require("mongoose");
const businessNotification = mongoose.model('Business_Notification', { 
    type:{type:String, required: true},
    desc:{type:String, required:true},    
    cropId: {
      type: mongoose.Schema.Types.String,
      ref: "business",
    },
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = businessNotification