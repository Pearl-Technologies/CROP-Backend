// external

const bodyParser = require('body-parser');
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer")
// const form = multer();
// internal
const ConnectDb = require("./config/db");
const stripe = require('stripe')('sk_test_51Mx307GGhIV5PAANJ3ODV14y6k2SKjFrd9FuG3wybL1UsooXDDVZe6QxHnHqH0Oy7EfS6dRvqcuU8xqHGevRG9bQ00yNUMET47');
const endpointSecret = 'whsec_38ef90abb326130228748b339460defddfe12628c498cdfd39cc55ec12815603';

// const categoryRoutes = require("./routes/categoryRoutes");
// const couponRoutes = require("./routes/couponRoute");
// const userRoute = require("./routes/userRoute");
// const orderRouter = require("./routes/orderRoute");
// const userOrderRoute = require("./routes/userOrderRoute");
// const userdataRoute = require("./routes/userdataRoute");
// const cartRoute=require("./routes/cartRoute");
// const wishlistRoute=require("./routes/wishlistRoute");
// const businessRoutes = require("./routes/business/business");
// const productsRoutes = require("./routes/business/product");
const admin = require("./routes/admin")
const superAdmin = require("./routes/superAdmin")

// app init
const app = express();
// middleware

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());
// app.use(form.any())
// run db
ConnectDb();
// routes

// app.use("/api/earncrop", categoryRoutes);
// app.use("/api/redeemcrop", categoryRoutes);
// app.use("/api/category", categoryRoutes);
// app.use('/api/coupon', couponRoutes);
// app.use('/api/user', userRoute);

// app.use('/api/order', orderRouter);
// app.use('/api/user-order', userOrderRoute);
// app.use('/api/userdata', userdataRoute);
// app.use('/api/cart', cartRoute);
// app.use('/api/wishlist', wishlistRoute);
// app.use("/api/business", businessRoutes);
// app.use("/api/products", productsRoutes);
app.use("/api/admin", admin);
app.use("/api/superAdmin", superAdmin);

// root route
app.get("/", (req, res) =>
{ 
  res.send("Apps worked successfullyssss");
});


// use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

app.post('/create-payment-link', async (req, res) => {

  try {
    const product  = await stripe.products.create({
      name:"the pearlcons technology"
    })
    const price = await stripe.prices.create({
      unit_amount:2000,
      currency:"aud",
      product:product.id,
      tax_behavior:'inclusive'
    })

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      after_completion: {type: 'redirect', redirect: {url: 'https://example.com'}},
    });
    console.log(paymentLink)
    // res.json({ url: paymentLink.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const fulfillOrder = (lineItems) => {
  // TODO: fill me in
  console.log("Fulfilling order", lineItems);
}

const createOrder = (session) => {
  // TODO: fill me in
  console.log("Creating order", session);
}

const emailCustomerAboutFailedPayment = (session) => {
  // TODO: fill me in
  console.log("Emailing customer", session);
}
app.post('/webhook', bodyParser.raw({type: 'application/json'}), async (request, response) => {
  const payload = request.body;
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      // Save an order in your database, marked as 'awaiting payment'
      createOrder(session);

      // Check if the order is paid (for example, from a card payment)
      //
      // A delayed notification payment will have an `unpaid` status, as
      // you're still waiting for funds to be transferred from the customer's
      // account.
      if (session.payment_status === 'paid') {
        fulfillOrder(session);
      }

      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object;

      // Fulfill the purchase...
      fulfillOrder(session);

      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object;

      // Send an email to the customer asking them to retry their order
      emailCustomerAboutFailedPayment(session);

      break;
    }
  }

  response.status(200).end();
});

// console.log(stripe)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
