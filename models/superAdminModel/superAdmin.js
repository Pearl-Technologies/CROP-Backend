const mongoose = require("mongoose");
const superAdmin = mongoose.model('Super_superAdmin', { 
    name: {type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},    
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = superAdmin