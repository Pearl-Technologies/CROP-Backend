// external
const bodyParser = require('body-parser');
const express = require("express");


const cors = require("cors");
require("dotenv").config();
const multer = require("multer")
const form = multer();
// internal
const ConnectDb = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const couponRoutes = require("./routes/couponRoute");
// const userRoute = require("./routes/userRoute");
const orderRouter = require("./routes/orderRoute");
const userOrderRoute = require("./routes/userOrderRoute");
const userdataRoute = require("./routes/userdataRoute");
const cartRoute=require("./routes/cartRoute");
const wishlistRoute=require("./routes/wishlistRoute");
const businessRoutes = require("./routes/business/business");
const productsRoutes = require("./routes/business/product");

// app init
const app = express();
// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(form.any())
// run db
ConnectDb();
// routes

app.use("/api/earncrop", categoryRoutes);
app.use("/api/redeemcrop", categoryRoutes);
app.use("/api/category", categoryRoutes);
app.use('/api/coupon', couponRoutes);
// app.use('/api/user', userRoute);
app.use('/api/order', orderRouter);
app.use('/api/user-order', userOrderRoute);
app.use('/api/userdata', userdataRoute);
app.use('/api/cart', cartRoute);
app.use('/api/wishlist', wishlistRoute);
app.use("/api/business", businessRoutes);
app.use("/api/products", productsRoutes);


// root route
app.get("/", (req, res) =>
{ 
  console.log("jhgyfgiyfi");
  res.send("Apps worked successfullysss");
});


// use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
