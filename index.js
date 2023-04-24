require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const multer = require("multer")
const ConnectDb = require("./config/db");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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
const superAdmin = require("./routes/superAdmin");


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
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

app.get("/", (req, res) =>
{ 
  res.send("Apps worked successfullyssss");
});


app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});
const PORT = 7001
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
