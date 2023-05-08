const stripe = require("stripe")(process.env.STRIPE_KEY);
const Order = require("../models/Order");
const { User } = require("../models/User");
const { Cart } = require("../models/Cart");
const random = require('alphanumeric')
const {
  customerPaymentTracker,
  customerRedeemTracker,
} = require("../models/admin/PaymentTracker/paymentIdTracker");
const {
  SaveMyCropTrasaction,
} = require("../controller/customerCropTransaction");
const mongoose = require("mongoose");
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
  const { cart, user_id } = req.body;
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
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.cartQuantity,
          };
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
        billing_address_collection: "required",
        shipping_address_collection: {
          allowed_countries: ["AU"],
        },
      };

      const session = await stripe.checkout.sessions.create(params);
      if (session.id) {
        await customerPaymentTracker.create({
          paymentId: session.id,
          status: "unpaid",
          paymentMethod: session.payment_method_types,
          paymentUrl: session.url,
          cartDetails: {
            id: req.body._id,
            user_id: req.body.user_id,
            cartItems: req.body.cart,
          },
        });

        // await Cart.updateMany(
        //   { 'user_id': mongoose.Types.ObjectId(user_id) },
        //   { $set: { 'cart.$[].purchaseStatus': 1 } }
        // )
        await Cart.deleteMany({ user_id: mongoose.Types.ObjectId(user_id) });
      }

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

module.exports.RedeemCrop = async (req, res) => {
  const { cart, user_id, _id } = req.body;
  let redeemCropPoints = 0;
  cart?.map((x) => {
    redeemCropPoints = redeemCropPoints + x.redeemCROPs;
  });
  console.log(redeemCropPoints);
  let findUser = await User.findOne({ _id: user_id.$oid });

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
  let orderNumber = random(7)
  await customerRedeemTracker.create({
    number:orderNumber,
    cartDetails: {
      id: _id.$oid,
      user_id: user_id.$oid,
      cartItems: cart,
    },
  });
  
  SaveMyCropTrasaction(
    1,
    redeemCropPoints,
    "debit",
    "purchase product by redeem CROP",
    orderNumber,
    user_id.$oid
  );
  //
  res.status(200).send({ msg: "CROP redemption success" });
  return;
};
