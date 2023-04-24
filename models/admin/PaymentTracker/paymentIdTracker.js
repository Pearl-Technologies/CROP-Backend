const mongoose = require("mongoose");
const adminPaymentTrackerSchema = mongoose.Schema({ 
    paymentLink:{type:String, required:true},
    productId:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'business_products'},       
    status:{type:String, required:true},
    paymentUrl:{type:String, required:true},
    paymentMethod:{type:Array},
    businessId:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'business'},
    invoice_url:{type:String, default:""},
    invoice_paid_time:{type:Number, defalut:0},
    invoice_pdf:{type:String, default:""},
    customer_email:{type:String, default:""},
    invoice_id:{type:String, default:""},
    payment_intent:{type:String, default:""},
    tries:{type:Number, default:0}
 }, {
    timestamps: true
 });

 const customerPaymentTrackerSchema = mongoose.Schema({ 
   paymentLink:{type:String, required:true},
   productId:[{type:mongoose.Schema.Types.ObjectId, required:true, ref:'business_products'}],
   status:{type:String, required:true},
   paymentUrl:{type:String, required:true},
   paymentMethod:{type:Array},
   businessId:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'business'},
   invoice_url:{type:String, default:""},
   invoice_paid_time:{type:Number, defalut:0},
   invoice_pdf:{type:String, default:""},
   customer_email:{type:String, default:""},
   coupon_code:{type:String, default: ""},
   invoice_id:{type:String, default:""},
   payment_intent:{type:String, default:""},
   tries:{type:Number, default:0}
}, {
   timestamps: true
});
 
const adminPaymentTracker = mongoose.model('Admin_payment_tracker', adminPaymentTrackerSchema)
const customerPaymentTracker = mongoose.model('Customer_payment_tracker', customerPaymentTrackerSchema)
module.exports = {adminPaymentTracker,customerPaymentTracker}