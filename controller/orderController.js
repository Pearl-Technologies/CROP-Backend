const stripe = require("stripe")(process.env.STRIPE_KEY);
const Order = require("../models/Order");
const {User} = require("../models/User");
const {customerPaymentTracker} = require("../models/admin/PaymentTracker/paymentIdTracker")
// create-payment-intent
// module.exports.paymentIntent = async (req, res) => { 
 
//   try {
//     let {price} = req.body;
    
//     const token = req.headers?.authorization?.split(" ")?.[1];
//     if(!price){
//       return res.status(406).send({msg:"product price is required"})
//     }
//     if(!token){
//       return res.status(406).send({msg:"you are not authorise"})
//     }
//      price = Number(price);
//     const amount = price * 100;
  
//     // Create a PaymentIntent with the order amount and currency
//     const paymentIntent = await stripe.paymentIntents.create({
//       currency: "usd",
//       amount: amount,
//       payment_method_types: ['card'],
//       description: 'Test Payment',
//       statement_descriptor: 'TEST PAYMENT',
//     });
//     console.log(paymentIntent.client_secret, "payments")

//   //  if(paymentIntent.client_secret)
//   //  {
//   //    const results=await User.updateOne({"token": token }, {$push: { auditTrail:`The payment is successfully paid` }});
//   //  }
//     res.status(200).send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } 
//   catch (error) {
//     console.log(error);
//   }
// };

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
    // const results=await User.updateOne({_id: userid }, {$push: { auditTrail:`The order is conformed` }});

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

module.exports.paymentIntent= async(req, res)=> {
  const {cart} = req.body;
  // res.send(req.body);
  // console.log(req.body);
  // return 
  if (req.method === "POST") {    
    try {
      const params = {
        submit_type: "pay",
        mode: "payment",
        invoice_creation: {enabled: true},
        payment_method_types: ["card", 'alipay'],
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
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          };
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['AU'],
        },
      };
      
      const session = await stripe.checkout.sessions.create(params);
      if(session.id){   
      await customerPaymentTracker.create({
        paymentId:session.id,
        status:"unpaid",
        paymentMethod:session.payment_method_types,
        paymentUrl:session.url,
        cartDetails:{
          id:req.body._id.$oid,
          user_id:req.body.user_id.$oid,
          cartItems:req.body.cart
        }
      })
    }

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

//adding the croppoints is remaining