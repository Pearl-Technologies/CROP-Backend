require("dotenv").config()
const express = require("express")
const cors = require("cors")
// const multer = require("multer")
const ConnectDb = require("./config/db")
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

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
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


app.get("/", (req, res) => {
  res.send("Apps worked successfullyssss")
})

global.TextEncoder = require('text-encoding').TextEncoder;

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

const PORT = process.env.PORT; 
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
