require("dotenv").config();
const stripe = require("stripe")(
  "sk_test_51Mx307GGhIV5PAANJ3ODV14y6k2SKjFrd9FuG3wybL1UsooXDDVZe6QxHnHqH0Oy7EfS6dRvqcuU8xqHGevRG9bQ00yNUMET47"
);
// const bodyParser = require('body-parser');
const express = require("express");
const cors = require("cors");
// const multer = require("multer")
const ConnectDb = require("./config/db");

const app = express();

const categoryRoutes = require("./routes/categoryRoutes");
const couponRoutes = require("./routes/couponRoute");
const orderRouter = require("./routes/orderRoute");
const userOrderRoute = require("./routes/userOrderRoute");
const userdataRoute = require("./routes/userdataRoute");
const cartRoute=require("./routes/cartRoute");
const wishlistRoute=require("./routes/wishlistRoute");
const businessRoutes = require("./routes/business/business");
const productsRoutes = require("./routes/business/product");
const admin = require("./routes/admin")
const superAdmin = require("./routes/superAdmin")

// app.use(express.json());
app.use(cors());
ConnectDb();

app.use("/api/earncrop", categoryRoutes);
app.use("/api/redeemcrop", categoryRoutes);
app.use("/api/category", categoryRoutes);
app.use('/api/coupon', couponRoutes);
app.use('/api/order', orderRouter);
app.use('/api/user-order', userOrderRoute);
app.use('/api/userdata', userdataRoute);
app.use('/api/cart', cartRoute);
app.use('/api/wishlist', wishlistRoute);
app.use("/api/business", businessRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/admin", admin);
app.use("/api/superAdmin", superAdmin);

// app.get("/", (req, res) =>
// { 
//   res.send("Apps worked successfullyssss");
// });

// app.use((err, req, res, next) => {
//   if (res.headersSent) return next(err);
//   res.status(400).json({ message: err.message });
// });


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_38ef90abb326130228748b339460defddfe12628c498cdfd39cc55ec12815603";
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event", event);

    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        

      return response.json({ success: true });
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
