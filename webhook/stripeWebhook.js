require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ConnectDb = require("../config/db");
ConnectDb();
const app = express();
const {
  adminPaymentTracker,
} = require("../models/admin/PaymentTracker/paymentIdTracker");
const { Product } = require("../models/businessModel/product");
const stripe = require("stripe")(
  "sk_test_51Mx307GGhIV5PAANJ3ODV14y6k2SKjFrd9FuG3wybL1UsooXDDVZe6QxHnHqH0Oy7EfS6dRvqcuU8xqHGevRG9bQ00yNUMET47"
);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_38ef90abb326130228748b339460defddfe12628c498cdfd39cc55ec12815603";
const createOrder = (session) => {
  // TODO: fill me in
//   console.log("Creating order", session);
};

const fulfillOrder = async (session) => {
//   console.log("Fulfilling order", session?.payment_link);
//   console.log(session);
  let findOne = await adminPaymentTracker.findOne({
    paymentLink: session?.payment_link,
  });
  if (findOne) {
    await Product.findByIdAndUpdate(
      { _id: findOne.productId },      
      { $set: { status: "published", market:true}  }
    );
    await adminPaymentTracker.findByIdAndUpdate(
      { _id: findOne._id },
      { $set: { status: "paid", paymentMethod:session.payment_method_types, payment_intent:session.payment_intent } }
    );

    console.log("Fulfilling order updated successfully");
  }
};

const emailCustomerAboutFailedPayment = async (session) => {
  console.log("Emailing customer", session);
};
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (request, response) => {
    const payload = request.body;
    const sig = request.headers["stripe-signature"];
    let paymentLink ="";
    let payment_intent= "";
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }
    // console.log(event);
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // Save an order in your database, marked as 'awaiting payment'
        createOrder(session);
        // Check if the order is paid (for example, from a card payment)
        //
        // A delayed notification payment will have an `unpaid` status, as
        // you're still waiting for funds to be transferred from the customer's
        // account.
        if (session.payment_status === "paid") {
          fulfillOrder(session);
        }

        break;
      }
      case "invoice.payment_succeeded": {
        const session = event.data.object;
            let findOne = await adminPaymentTracker.findOne({
                payment_intent:session.payment_intent
              });
              if (findOne) {
                await adminPaymentTracker.findByIdAndUpdate(
                  { _id: findOne._id },
                  { $set: { 
                    status: session.status, 
                    invoice_paid_time:session.created, 
                    customer_email:session.customer_email, 
                    invoice_id:session.id, 
                    invoice_url:session.hosted_invoice_url, 
                    invoice_pdf:session.invoice_pdf
                    } }
                );
                // , hosted_invoice_url,: "",
                console.log("successfully updated");
              }              
        
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;

        // Fulfill the purchase...
        fulfillOrder(session);

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;

        // Send an email to the customer asking them to retry their order
        emailCustomerAboutFailedPayment(session);

        break;
      }
    }

    response.status(200).end();
  }
);
const PORT = process.env.PORT;
app.listen(4242, () => console.log(`server running on port ${4242}`));
