require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const ConnectDb = require("./config/db")
const createError = require('http-errors')
const app = express()
const bodyParser = require("body-parser")

app.use(bodyParser.json())

const categoryRoutes = require("./routes/categoryRoutes")
const couponRoutes = require("./routes/couponRoute")
const orderRouter = require("./routes/orderRoute")
const userOrderRoute = require("./routes/userOrderRoute")
const userdataRoute = require("./routes/userdataRoute")
const cartRoute = require("./routes/cartRoute")
const wishlistRoute = require("./routes/wishlistRoute")
const businessRoutes = require("./routes/business/business")
const productsRoutes = require("./routes/business/product")
const storeProductsRoutes = require("./routes/business/storeproduct")
const admin = require("./routes/admin")
const superAdmin = require("./routes/superAdmin")
const address = require("./routes/addresRoute")
const customerCropTransaction = require("./routes/customerCropTrasaction")
const count = require("./routes/count");
const purchaseRequest = require("./routes/purchaseProintConroller")
const tokenExpiry = require("./routes/expire");
const chatRoute = require("./routes/chatRoute");

const allowedOrigins = [
  "http://192.168.0.107:3000",
  "http://192.168.0.101:3000",
  "http://192.168.0.112:3000",
  "http://192.168.59.32:3000",
  "http://192.168.59.32:7000",
  "http://localhost:7000",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://cropglobalservices.com",
  "http://cropglobalservices.com",
  "https://business.cropglobalservices.com",
  "http://business.cropglobalservices.com",
  "https://admin.cropglobalservices.com",
  "http://admin.cropglobalservices.com",
]

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors(corsOptions));
// app.use(cors())
ConnectDb()
app.use("/api/earncrop", categoryRoutes)
app.use("/api/redeemcrop", categoryRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/coupon", couponRoutes)
app.use("/api/order", orderRouter)
app.use("/api/user-order", userOrderRoute)
app.use("/api/userdata", userdataRoute)
app.use("/api/cart", cartRoute)
app.use("/api/wishlist", wishlistRoute)
app.use("/api/business", businessRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/crop_trasaction", customerCropTransaction)
app.use("/api/store/products", storeProductsRoutes)
app.use("/api/admin", admin)
app.use("/api/superAdmin", superAdmin)
app.use("/api/address", address)
app.use("/api",count);
app.use("/api/customer/royalty", purchaseRequest)
app.use("/api/checkToken",tokenExpiry);
app.use("/api",chatRoute);


app.get("/", (req, res) => {
  res.send("Apps worked successfully")
})

// global.TextEncoder = require('text-encoding').TextEncoder;

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});
app.use(async(req, res, next)=>{
  next(createError.NotFound("this route doesn't exist"))
})

const PORT = process.env.PORT; 
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
