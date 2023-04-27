const mongoose = require("mongoose")
const customerCropTransaction = mongoose.model("customer_crop_trasaction", {
orderNumber:{type:String, require:true},
transactionType:{type:String, require:true},
crop:{type:Number, require:true},
amount:{type:Number, required:true},
user:{type:mongoose.Schema.Types.ObjectId, ref:"user_customer", required:true},
createdAt:{type:Date, default:Date.now()}
})

module.exports = customerCropTransaction