const { timeStamp } = require("console");
const mongoose = require("mongoose");
const adminPropValuation = mongoose.model('admin_prop_valuation', { 
    defaultProp:{type:Number, default:1},
    purchaseProp:{type:Number, default:1.5},      
    defaultCrop:{type:Number, default:0.15},
    purchaseCrop:{type:Number, default:0.1},    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin_admin",
    },
 });
 

module.exports = adminPropValuation