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
    tries:{type:Number, default:0},
    number:{type:String},
    amount:{type:Number},
    description:{type:String}
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
   },
   delivery_address:{
      status: {type:Boolean, default:true},
      line1:{type:String},
       line2:{type:String},
      line3:{type:String},
       state:{type:String},
       city:{type:String},
       pin:{type:Number}
       },
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
   user:{type:mongoose.Schema.Types.ObjectId, ref:"users_customer", require:true}
}, {
   timestamps: true
});

const adminPropPaymentOnMilestoneSchema = mongoose.Schema({ 
   paymentLink:{type:String, require:true},
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
   user:{type:mongoose.Schema.Types.ObjectId, ref:"users_customer", require:true},
   milestone:{type:Number}
}, {
   timestamps: true
});

const customerRedeemTrackerSchema = mongoose.Schema({ 
   number:{type:String, default:""},
   customer_address:{type:Array},
   customer_shipping:{type:Array},
   name:{type:String},
   cartDetails:{
      id:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'carts_customers'},
      user_id:{type:mongoose.Schema.Types.ObjectId, require:true, ref:'users_customers'},
      cartItems:{type:Object, require:true}
   },
   address_id:{type:String},
   email:{type:String},
   status:{type:String}
}, {
   timestamps: true
});
const customerPropRedeemTrackerSchema = mongoose.Schema({ 
   number:{type:String, default:""},
   customer_address:{type:Array},
   customer_shipping:{type:Array},
   name:{type:String},
   cartDetails:{
      id:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'carts_customers'},
      user_id:{type:mongoose.Schema.Types.ObjectId, require:true, ref:'users_customers'},
      cartItems:{type:Object, require:true}
   },
   address_id:{type:String},
   email:{type:String},
   status:{type:String},
   coupon:{type:Array},
}, {
   timestamps: true
});


 
const adminPaymentTracker = mongoose.model('Admin_payment_tracker', adminPaymentTrackerSchema)
const customerPaymentTracker = mongoose.model('Customer_payment_tracker', customerPaymentTrackerSchema)
const customerPurchsedTracker = mongoose.model('Customer_Purchased_Point_tracker', customerPurchsedTrackerSchema)
const adminPropPaymentOnMilestoneTracker = mongoose.model('Admin_Prop_Payment_on_milestone', adminPropPaymentOnMilestoneSchema)
const customerRedeemTracker = mongoose.model('customerRedeemTracker', customerRedeemTrackerSchema)
const customerPropRedeemTracker = mongoose.model('customerPropRedeemTracker', customerPropRedeemTrackerSchema)
module.exports = {adminPaymentTracker, customerPaymentTracker, customerPurchsedTracker, adminPropPaymentOnMilestoneTracker, customerRedeemTracker, customerPropRedeemTracker}