const mongoose = require("mongoose");
const adminNotification = mongoose.model('Admin_Notification', { 
    type:{type:String, required: true},
    description:{type:String, required:true},    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin_user",
    },
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = adminNotification