const mongoose = require("mongoose");
const interestList = mongoose.model('admin_interestList', { 
    interestName:{type:String, require:true},       
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
      required:true
    },
 });
 

module.exports = interestList