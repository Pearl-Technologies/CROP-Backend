const stripe = require("stripe")(process.env.STRIPE_KEY);
const {customerPointPurchasedTracker} = require("../controller/adminController/PaymentController/payment")
module.exports.purchaseRequest = async (req, res) => {
  const { type, quantity, user_id } = req.body;
  console.log(req.body);
//   let type:"CROP",
//   let type1:"PROP",
//   crop_amount: 100
//   prop_amount:10
//   1crop = .10AUD,
//   1prop = 1prop  
    let  cropValue = 0.15
    try {
      const params = {
        submit_type: "pay",
        mode: "payment",
        line_items: [{
            price_data: {
              currency: 'aud',
              product_data: {
                name: type,
              },
              unit_amount: cropValue,
            },
            quantity: quantity,
          }],
        invoice_creation: { enabled: true },
        payment_method_types: ["card", "alipay"],
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      };

      const session = await stripe.checkout.sessions.create(params);
      console.log(session);
      return
      if (session.id) {
        await customerPointPurchasedTracker.create({
          paymentId: session.id,
          status: "unpaid",
          paymentMethod: session.payment_method_types,
          paymentUrl: session.url,
        });
      }

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }

};
module.exports.purchasePropRequest = async (req, res) => {
  const { cart, user_id } = req.body;
  return;
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
