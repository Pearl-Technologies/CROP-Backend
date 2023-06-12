const {
  adminPaymentTracker,
} = require("../../models/admin/PaymentTracker/paymentIdTracker")
const business = require("../../models/businessModel/business")
const { StoreProduct } = require("../../models/businessModel/storeproducts")
const {
  createStoreProductServiceRequest,
  updateStoreProductServiceRequest,
} = require("./businessNotification/compalintNotification")

module.exports.addStoreProduct = async (req, res) => {
  try {
    console.log("user", req.user.user)
    const id = req.user.user.id
    const busi = await business.findById(id)
    req.body.user = id
    console.log(busi)
    req.body.city = busi.address[0].city
    req.body.croppoints = req.body.price
    const newProduct = new StoreProduct(req.body)
    const storeProduct = await newProduct.save()
    createStoreProductServiceRequest(id, storeProduct._id)
    res.status(200).send({
      message: "Product added successfully",
      productId: newProduct._id,
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: err.message,
    })
  }
}

module.exports.uploadStoreProductImages = async (req, res) => {
  try {
    const productId = req.params.productId
    const fileName = req.files[0].filename
    console.log(fileName, "fileName")
    await StoreProduct.findByIdAndUpdate(
      { _id: productId },
      { $push: { image: fileName } }
    )
    return res.status(200).send({ success: true, fileName })
  } catch (error) {
    console.log(error)
  }
}

module.exports.getAllStoreProductsByBusiness = async (req, res) => {
  console.log("running")
  const user = req.user.user.id
  console.log("userID", user)
  try {
    const products = await StoreProduct.find({ user })
    res.status(200).json({ count: products.length, products })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
    })
  }
}

module.exports.getSingleStoreProduct = async (req, res) => {
  try {
    const product = await StoreProduct.findOne({ _id: req.params.id })
    res.json(product)
  } catch (err) {
    res.status(500).send({
      message: err.message,
    })
  }
}

module.exports.updateStoreProduct = async (req, res) => {
  const { id } = req.params
  try {
    delete req.body._id
    req.body.status = "inActive"
    const products = await StoreProduct.findByIdAndUpdate({ _id: id }, req.body)
    console.log("running")
    await updateStoreProductServiceRequest(id)
    res.status(200).json({ products, productId: products._id })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
    })
  }
}

module.exports.removeStoreProduct = async (req, res) => {
  const { id } = req.params
  try {
    await StoreProduct.findByIdAndRemove({ _id: id })
    res
      .status(200)
      .json({ status: "success", msg: "Product Removed Successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
    })
  }
}

module.exports.getStoreBiddedProductsByBusiness = async (req, res) => {
  console.log("api triggering")
  const user = req.user.user.id
  const bid = true
  console.log(user)
  try {
    const biddedProducts = await StoreProduct.find({ user, bid }, { status: 0 })
    return res.status(200).send({ success: true, biddedProducts })
  } catch (error) {
    console.log(error)
  }
}

module.exports.getBiddingSelectedStoreProductsDetailsByBusiness = async (
  req,
  res
) => {
  const businessId = req.user.user.id
  try {
    const biddingSelectedProducts = await adminPaymentTracker.find({
      businessId,
    })
    return res.status(200).send({ success: true, biddingSelectedProducts })
  } catch (error) {
    console.log(error)
  }
}

module.exports.getAllStoreProducts = async (req, res) => {
  const limit = req.params.limit || 10
  const page = req.params.page || 1
  const skip = (page - 1) * limit
  try {
    const storeProducts = await StoreProduct.aggregate([
      {
        $match: {
          status: "active",
        },
      },
      {
        $match: {
          $or: [
            {
              title: {
                $regex: req.query.search,
                $options: "i",
              },
            },
          ],
        },
      },
    ])
      .skip(parseInt(skip))
      .limit(parseInt(limit))
    const storeProductsCount = await StoreProduct.aggregate([
      {
        $match: {
          $or: [{ title: { $regex: req.query.search, $options: "i" } }],
        },
      },
    ])
    return res
      .status(200)
      .send({ count: storeProductsCount.length, storeProducts })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

module.exports.getStorePromoProductsByBusiness = async (req, res) => {
  const user = req.user.user.id
  console.log({ user })
  try {
    const promoProducts = await StoreProduct.find({
      user,
      mktOfferFor: "promo",
      market: true,
    })
    console.log({ user })
    console.log(promoProducts)
    return res.status(200).send({ promoProducts })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}
