const stripe = require("stripe")(process.env.STRIPE_KEY);
const {customerPointPurchasedTracker} = require("../controller/adminController/PaymentController/payment")
module.exports.purchaseRequest = async (req, res) => {
  const { type, quantity, user_id } = req.body;
  if(!type || !quantity || !user_id){
    return res.status(400).send({msg:"type, quantity, userId is required"})
  }
//   let type:"CROP",
//   let type1:"PROP",
//   crop_amount: 100
//   prop_amount:10
//   1crop = .10AUD,
//   1prop = 1prop  
let value  
if(type=="CROP"){
    value = 0.10
  }else if(type == "PROP"){
    value=1
  }
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
              unit_amount: value*100
            },
            quantity: quantity,
          }],
        invoice_creation: { enabled: true },
        payment_method_types: ["card", "alipay"],
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      };
      const session = await stripe.checkout.sessions.create(params)

      if (session.id) {
        await customerPointPurchasedTracker(
          session.id,
          session.payment_status,
          session.payment_method_types,
          session.url,
          type,
          session.amount_subtotal/100,
          quantity,
          user_id
        );
      }

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }

};

