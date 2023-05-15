const stripe = require("stripe")(process.env.STRIPE_KEY);
const Order = require("../models/Order");
const { User } = require("../models/User");
const { Cart } = require("../models/Cart");
const {Token} = require("../models/User");
const StateSchema = require('../models/State');
const random = require('alphanumeric')
const {Product} = require("../models/businessModel/product");
const {
  customerPaymentTracker,
  customerRedeemTracker,
  customerPropRedeemTracker
} = require("../models/admin/PaymentTracker/paymentIdTracker");
const {
  SaveMyCropTrasaction,
} = require("../controller/customerCropTransaction");
const {SaveMyPropTrasaction} = require("../controller/customerPropTransaction");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// create-payment-intent

module.exports.addOrder = async (req, res) => {
  try {
    const orderItems = req.body;
    const croppoints = orderItems.points;
    const userid = orderItems.user;

    const newOrders = new Order(orderItems);
    const userData = await User.findOne({
      _id: userid,
    });

    const points = userData.croppoints + croppoints;

    const result = await User.updateOne(
      { _id: userid },
      { $set: { croppoints: points } }
    );
    const order = await newOrders.save();
    res.status(200).send({
      success: true,
      message: "Order added successfully",
      order: order,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.paymentIntent = async (req, res) => {
  const { cart, user_id, address_id } = req.body;
  // res.send(req.body);
  // console.log(req.body);
  // return
  if (req.method === "POST") {
    try {
      const params = {
        submit_type: "pay",
        mode: "payment",
        invoice_creation: { enabled: true },
        payment_method_types: ["card", "alipay"],
        billing_address_collection: "auto",
        line_items: cart.map((item) => {
          return {
            price_data: {
              currency: "aud",
              product_data: {
                name: item.title,
                images: item.image,
              },
              unit_amount: item.price * 100,
            },
            // adjustable_quantity: {
            //   enabled: true,
            //   minimum: 1,
            // },
            quantity: item.cartQuantity,
          };
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
        customer_email: req.body.email_id
        // billing_address_collection: 'required',
        // shipping_address_collection: {
        //   allowed_countries: ['AU'],
        // },
      };

      // for(let p=0; p<req.body.cart.length; p++){
      //   await Cart.deleteMany(
      //     { 'user_id': mongoose.Types.ObjectId(user_id), 'cart.$._id': req.body.cart[p]._id }
      //   )
      // }
      const session = await stripe.checkout.sessions.create(params);
      if(session.id){   
        let adddata = await User.find({_id:user_id})
        for(let i=0; i<adddata[0].address.length; i++){
          if(address_id == adddata[0].address[i]._id.valueOf()){
            var state = await StateSchema.findOne({id:adddata[0].address[i].state})
            var obj = { 
              line1:adddata[0].address[i].line1,
              line2:adddata[0].address[i].line2,
              line3:adddata[0].address[i].line3,
              state:state.name,
              city:adddata[0].address[i].city,
              pin:adddata[0].address[i].pin 
            }
          }
        }
        
        await customerPaymentTracker.create({
          paymentId:session.id,
          status:"unpaid",
          paymentMethod:session.payment_method_types,
          paymentUrl:session.url,
          cartDetails:{
            id:req.body._id,
            user_id:req.body.user_id,
            cartItems:req.body.cart
          },
          delivery_address:obj
        })

      // await Cart.updateMany(
      //   { 'user_id': mongoose.Types.ObjectId(user_id) },
      //   { $set: { 'cart.$[].purchaseStatus': 1 } }
      // )
    }
      res.status(200).json(session);
    }      
     catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

module.exports.RedeemCrop = async (req, res) => {
  const { cart, _id, address_id, email_id } = req.body;
  let token= req.headers.authorization
  const token_data = await Token.findOne({ token });
  let user_id= token_data.user;
  if(token_data){
    let redeemCropPoints = 0;
    cart?.map((item) => {
      redeemCropPoints = redeemCropPoints + item.tempRedeem;
    });
    let findUser = await User.findOne({ _id: user_id });  
    if (redeemCropPoints > findUser.croppoints) {
      return res
        .status(200)
        .send({ msg: "sorry insoffient CROP in your account" });
    }
    let newCropPoint = findUser.croppoints - redeemCropPoints;
    await User.findByIdAndUpdate(
      { _id: findUser._id },
      { $set: { croppoints: newCropPoint } }
    );
    cart.map(async(data)=>{
      let findProduct = await Product.findOne({_id:data._id});
      let newQuatity = findProduct.quantity - data.cartQuantity;
      await Product.findByIdAndUpdate({_id:findProduct._id}, {$set:{quantity:newQuatity}})
      await Cart.updateMany({ user_id: user_id},{$pull: {cart:{_id: data._id }}})
    })
    let orderNumber = random(7)
    await customerRedeemTracker.create({
      number:orderNumber,
      cartDetails: {
        id: _id,
        user_id: user_id,
        cartItems: cart,
      },
      address_id:address_id,
    email:email_id,
    status:"paid"
    });
    
    SaveMyCropTrasaction(
      1,
      redeemCropPoints,
      "debit",
      "purchase product by redeem CROP",
      orderNumber,
      user_id
    );
    //
    res.status(200).send({ msg: "CROP redemption success", status:200 });
  }
  else{
    res.status(500).send({ msg: "Token Not There", status:500 });
  }
  return;
};

module.exports.RedeemProp = async (req, res) => {
  const { cart, _id, address_id, email_id } = req.body;
  let token= req.headers.authorization
  // console.log(req.headers);
  // const token_data = await Token.findOne({ token });
  // let user_id= token_data.user;
  let user_id= "64523209aa7185fc036b3fdb";
  // console.log(use);
  // return
  if(user_id){
    let redeemPropPoints = 0;
    cart?.map((item) => {
      console.log(item.redeemProps)
      redeemPropPoints = redeemPropPoints + (item?.cartQuantity * item?.redeemProps);
    });

    let findUser = await User.findOne({ _id: ObjectId(user_id) });  
    if (redeemPropPoints > findUser.proppoints) {
      return res
        .status(200)
        .send({ msg: "sorry insoffient PROP in your account", redirect:true});
    }
    let newPropPoint = findUser.proppoints - redeemPropPoints;
    await User.findByIdAndUpdate(
      { _id: findUser._id },
      { $set: { proppoints: newPropPoint } }
    );
    let couponList = []
    const stripe = require('stripe')(process.env.STRIPE_KEY);
    cart.map(async(data)=>{
      let findProduct = await Product.findOne({_id:data._id});
      let newQuatity = findProduct.quantity - data.cartQuantity;
      await Product.findByIdAndUpdate({_id:findProduct._id}, {$set:{quantity:newQuatity}})
      await Cart.updateMany({ user_id: user_id},{$pull: {cart:{_id: data._id }}})
    })
    const coupon = await stripe.coupons.create({
      percent_off: 25.5,
      duration: 'repeating',
      duration_in_months: 3,
    });
    couponList.push(coupon);
    let orderNumber = random(7)
    await customerPropRedeemTracker.create({
      number:orderNumber,
      cartDetails: {
        id: _id.$oid,
        user_id: user_id.$oid,
        cartItems: cart,
      },
      address_id:address_id,
    email:email_id,
    status:"paid",
    coupon:couponList
    });
    
    SaveMyPropTrasaction(
      0,
      redeemPropPoints,
      "debit",
      "purchase product by redeem PROP",
      orderNumber,
      user_id
    );
    //
    res.status(200).send({ msg: "PROP redemption success", status:200, couponList });
  }
  else{
    res.status(500).send({ msg: "Token Not There", status:500 });
  }
  return;
};
