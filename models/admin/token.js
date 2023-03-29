const mongoose = require("mongoose");

const token = mongoose.model('Admin_token', { 
    token:{type:Object},
    email:{type:String}
 });


module.exports = token