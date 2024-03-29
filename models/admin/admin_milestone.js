const mongoose = require("mongoose");
const adminMilestone = mongoose.model('Admin_milestone', { 
    first:{
        blue:{type:Number, required:true},
        silver:{type:Number, required:true},
        gold:{type:Number, required:true},
        platinum:{type:Number, required:true}
    },
    second:{
        blue:{type:Number, required:true},
        silver:{type:Number, required:true},
        gold:{type:Number, required:true},
        platinum:{type:Number, required:true}
    }, 
    third:{
        blue:{type:Number, required:true},
        silver:{type:Number, required:true},
        gold:{type:Number, required:true},
        platinum:{type:Number, required:true}
    },       
    fourth:{
        blue:{type:Number, required:true},
        silver:{type:Number, required:true},
        gold:{type:Number, required:true},
        platinum:{type:Number, required:true}
    },       
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin_admin",
        required:true
    },
    createdAt:{type:Date, default:Date.now},
 });
 

module.exports = adminMilestone