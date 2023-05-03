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
   paymentId:{type:String, require:true},
   productId:[{type:mongoose.Schema.Types.ObjectId, required:true, ref:'business_products'}],
   status:{type:String, required:true},
   paymentUrl:{type:String, required:true},
   paymentMethod:{type:Array},
   invoice_url:{type:String, default:""},
   invoice_paid_time:{type:Number, defalut:0},
   invoice_pdf:{type:String, default:""},
   customer_email:{type:String, default:""},
   coupon_code:{type:String, default: ""},
   invoice_id:{type:String, default:""},
   payment_intent:{type:String, default:""},
   number:{type:String, default:""},
   customer_address:{type:Array},
   customer_shipping:{type:Array},
   name:{type:String},
   cartDetails:{
      id:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'carts_customers'},
      user_id:{type:mongoose.Schema.Types.ObjectId, require:true, ref:'users_customers'},
      cartItems:{type:Object, require:true}
   }
}, {
   timestamps: true
});

const customerPurchsedTrackerSchema = mongoose.Schema({ 
   paymentId:{type:String, require:true},
   status:{type:String, required:true},
   paymentUrl:{type:String, required:true},
   paymentMethod:{type:Array},
   invoice_url:{type:String, default:""},
   invoice_paid_time:{type:Number, defalut:0},
   invoice_pdf:{type:String, default:""},
   customer_email:{type:String, default:""},
   invoice_id:{type:String, default:""},
   payment_intent:{type:String, default:""},
   name:{type:String},
   type:String,
   amount:Number,
   quantity:Number,
   user:{type:mongoose.Schema.Types.ObjectId, ref:"users_customer"}
}, {
   timestamps: true
});
 
const adminPaymentTracker = mongoose.model('Admin_payment_tracker', adminPaymentTrackerSchema)
const customerPaymentTracker = mongoose.model('Customer_payment_tracker', customerPaymentTrackerSchema)
const customerPurchsedTracker = mongoose.model('Customer_Purchased_Point_tracker', customerPurchsedTrackerSchema)
module.exports = {adminPaymentTracker, customerPaymentTracker, customerPurchsedTracker}