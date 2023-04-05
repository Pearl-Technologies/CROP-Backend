const mongoose = require("mongoose");
const adminNotification = mongoose.model('Admin_Notification', { 
    type:{type:String, required: true},
    description:{type:String, required:true},    
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = adminNotification