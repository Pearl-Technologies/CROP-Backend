const stripe = require("stripe")(process.env.STRIPE_KEY);
const Order = require("../models/Order");
const {User} = require("../models/User");

// create-payment-intent
module.exports.paymentIntent = async (req, res) => {  
  try {
    const product = req.body;
    const token = req.headers?.authorization?.split(" ")?.[1];

    const price = Number(product.price);
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount,
      payment_method_types: ['card'],
      description: 'Test Payment',
      statement_descriptor: 'TEST PAYMENT',
    });

    console.log(paymentIntent.client_secret,"payments")

   if(paymentIntent.client_secret)
   {
     const results=await User.updateOne({"token": token }, {$push: { auditTrail:`The payment is successfully paid` }});
   }
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } 
  catch (error) {
    console.log(error);
  }
};

module.exports.addOrder = async (req, res) => {
  try {
    const orderItems = req.body;
    const croppoints=orderItems.points
     const userid=orderItems.user;

    const newOrders = new Order(orderItems);
    const userData=await User.findOne(
      {
        _id: userid       
      });

    const points= userData.croppoints + croppoints;

    const result=await User.updateOne({_id: userid }, {$set: { croppoints:points }});
    const results=await User.updateOne({_id: userid }, {$push: { auditTrail:`The order is conformed` }});

    const order = await newOrders.save();
    res.status(200).send({
      success: true,
      message: "Order added successfully",
      order: order,
    });
  } 
  catch (error) {
    console.log(error);
  }
};

//adding the croppoints is remaining