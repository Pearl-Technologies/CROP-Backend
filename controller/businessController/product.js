const fs = require("fs")
const {
  Product,
  productComment,
} = require("../../models/businessModel/product")
const { Cart } = require("../../models/Cart")
const { Token } = require("../../models/User")
const {
  adminPaymentTracker,
} = require("../../models/admin/PaymentTracker/paymentIdTracker")
const business = require("../../models/businessModel/business")
const NodeGeocoder = require("node-geocoder")
const mongoose = require("mongoose")
const adminBusinessGeneralNotification = require("../../models/admin/notification/businessGeneralNotification")
const generalNotification = require("../../models/businessModel/businessNotification/generalNotification")
const businessMarketOffer = require("../../models/businessModel/marketOffer")
const ObjectId = mongoose.Types.ObjectId

// addAllProducts
module.exports.addProduct = async (req, res) => {
  try {
    // console.log("user", req.user.user)
    const id = req.user.user.id
    const busi = await business.findById(id)
    req.body.user = id
    req.body.city = busi.address[0].city
    req.body.croppoints = req.body.price
    console.log(req.body.city, "city")
    const newProduct = new Product(req.body)
    const product = await newProduct.save()
    // console.log({ product })
    const adminProductCreateNotification =
      await adminBusinessGeneralNotification.findOne({})
    let desc =
      adminProductCreateNotification?.upload_and_removal_of_offer ||
      "New Product Created"
    const newProductNotifiaction = new generalNotification({
      type: "productCreation",
      desc,
      businessId: id,
      newProduct: {
        productId: product._id,
        productTitle: product.title,
        productApply: product.apply,
      },
    })
    await newProductNotifiaction.save()
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
// addAllProducts

module.exports.createMarketProducts = async (req, res) => {
  const businessId = req.user.user.id
  try {
    req.body.businessId = businessId
    req.body.bid = true
    const businessMarket = new businessMarketOffer(req.body)
    await businessMarket.save()
    return res.status(200).send("Product Applied For Market")
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
}

module.exports.getMarketProductsByBusiness = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const marketProducts = await businessMarketOffer.aggregate([
      { $match: { businessId: ObjectId(businessId) } },
      {
        $lookup: {
          from: "business_products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "admin_payment_trackers",
          localField: "productId",
          foreignField: "productId",
          as: "payment",
        },
      },
      { $unwind: "$payment" },
      {
        $project: {
          product: 1,
          payment: 1,
          _id: 1,
          marketOfferFor: 1,
          slot: 1,
          marketDate: 1,
          bidPrice: 1,
          basePrice: 1,
          market: 1,
          bid: 1,
        },
      },
    ])
    return res.status(200).send({ marketProducts })
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
}

module.exports.getUniqueMarketProductDetails = async (req, res) => {
  const { marketId } = req.params
  try {
    const marketProduct = await businessMarketOffer.aggregate([
      {
        $match: { _id: ObjectId(marketId) },
      },
      {
        $lookup: {
          from: "business_products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "admin_payment_trackers",
          localField: "productId",
          foreignField: "productId",
          as: "payment",
        },
      },
      { $unwind: "$payment" },
      {
        $project: {
          product: 1,
          payment: 1,
          _id: 1,
          marketOfferFor: 1,
          slot: 1,
          marketDate: 1,
          bidPrice: 1,
          basePrice: 1,
          market: 1,
          bid: 1,
          createdAt: 1,
        },
      },
    ])
    return res.status(200).send({ marketProduct: marketProduct[0] })
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
}

module.exports.addAllProducts = async (req, res) => {
  try {
    await Product.deleteMany()
    const result = await Product.insertMany(req.body)
    res.send({
      message: "Products added successfully",
      result,
    })
  } catch (err) {
    res.status(500).send({
      message: err.message,
    })
  }
}

// get all category
module.exports.getShowingProducts = async (req, res) => {
  //  const result= await Product.updateMany(
  //     { type: "Top Rated"},
  //     {
  //       $set: { croppoints: 300 }
  //     }
  //   )
  // }
  try {
    const result = await Product.find({ status: "active" })
    res.status(200).json({
      success: true,
      products: result,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
// getDiscountProduct
module.exports.getDiscountProduct = async (req, res) => {
  try {
    const discountProducts = await Product.find({ discount: { $gt: 0 } })
    res.json({
      success: true,
      products: discountProducts,
    })
  } catch (err) {
    res.status(500).send({
      message: err.message,
    })
  }
}

module.exports.getSingleProductByBusiness = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id })
    return res.status(200).json(product)
  } catch (error) {
    return res.status(500).send({
      message: err.message,
    })
  }
}

// getDiscountProduct
module.exports.getSingleProduct = async (req, res) => {
  try {
    const token = req.headers.authorization
    if (token == undefined) {
      const product = await Product.findOne({ _id: req.params.id })
      const newProductComment = await productComment.find({
        $and: [{ status: true }, { product_id: req.params.id }],
      })
      if (newProductComment.length != 0) {
        product._doc.productComments = newProductComment[0].details
        product._doc.productLikes = newProductComment[0].product_likes.length
      } else {
        product._doc.productComments = []
        product._doc.productLikes = 0
      }
      product._doc.statusCart = 0

      res.status(200).json(product)
    } else {
      const token_data = await Token.findOne({ token })
      const product = await Product.findOne({ _id: req.params.id })
      const cartnew = await Cart.find({
        user_id: token_data.user,
        cart: { $elemMatch: { _id: req.params.id } },
      })
      const newProductComment = await productComment.find({
        $and: [{ status: true }, { product_id: req.params.id }],
      })
      if (cartnew.length == 0) {
        product._doc.statusCart = 0
      } else {
        product._doc.statusCart = 1
      }
      if (newProductComment.length != 0) {
        product._doc.productComments = newProductComment[0].details
        product._doc.productLikes = newProductComment[0].product_likes.length
      } else {
        product._doc.productComments = []
        product._doc.productLikes = 0
      }

      res.status(200).json(product)
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    })
  }
}

// get related products
module.exports.getRelatedProducts = async (req, res) => {
  const { tags } = req.query
  const queryTags = tags?.split(",")
  try {
    const product = await Product.find({ tags: { $in: queryTags } }).limit(4)
    res.status(200).json({
      status: true,
      product,
    })
  } catch (err) {
    res.status(500).send({
      message: err.message,
    })
  }
}

module.exports.getProductsByCatagory = async (req, res) => {
  const category = req.body.category
  console.log(category, "categories")
  try {
    // let product = []
    // await category.map(async (cate) => {
    //   let children = cate;
    //   let products = await Product.find({children});
    //   products.forEach(element => {
    //     product.push(element)
    //   })
    //})
    const result = await Product.find({
      $and: [{ status: "active" }, { parent: category }],
    })
    return res.status(200).json({ result })
  } catch (error) {
    s
    console.log(error)
    res.status(500).send({
      message: error.message,
    })
  }
}

// Get Products By Sub Category
module.exports.getProductsBySubCatagory = async (req, res) => {
  const { subCategoryId } = req.params
  try {
    const products = await Product.find({ subCategoryId })
    res.status(200).json({ products })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
    })
  }
}

module.exports.updateProduct = async (req, res) => {
  const { id } = req.params
  try {
    delete req.body._id
    const products = await Product.findByIdAndUpdate({ _id: id }, req.body)
    res.status(200).json({ products, productId: products._id })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
    })
  }
}

module.exports.removeProduct = async (req, res) => {
  const { id } = req.params
  try {
    const removedProduct = await Product.findByIdAndRemove({ _id: id })
    console.log({ removedProduct })
    const adminProductCreateNotification =
      await adminBusinessGeneralNotification.findOne({})
    let desc =
      adminProductCreateNotification?.upload_and_removal_of_offer ||
      "Product Removed"
    const productRemovalNotifiaction = new generalNotification({
      type: "productRemoval",
      desc,
      businessId: removedProduct.user,
      removedProduct: {
        productTitle: removedProduct.title,
      },
    })
    await productRemovalNotifiaction.save()
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

module.exports.getAllProductsByBusiness = async (req, res) => {
  const user = req.user.user.id

  try {
    const products = await Product.find({ user }).sort({ _id: -1 })
    res.status(200).json({ count: products.length, products })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
    })
  }
}

//new 
module.exports.getallproduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
    })
  }
}

//getsectorbasedproduct
module.exports.getsectorbasedproduct = async (req, res) => {
  const { sector } = req.params;
  console.log('sector!@#', sector)
  const value = sector === "Dines"?"Dine" : sector === "Shop"?"Shops":sector === "Hotel"?"Hotel":sector === "Service"?"Service":sector
  console.log('value!@#', value)
  try {
    const products = await Product.find({ sector: value });
    console.log('products', products)
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
};










module.exports.getEarnCropProducts = async (req, res) => {
  try {
    const dateTime = new Date()
    const sDate = dateTime.toISOString()
    const today = sDate.split("T")[0]
    // console.log(dateTime.getDay(), "day");
    const currentDay = dateTime.getDay()
    const t = dateTime.toLocaleString("en-GB").split(" ")
    const th = t[1].split(":")
    console.log(today, "today")
    const time = th[0] + ":" + th[1]
    console.log("2023-04-02" < today, "Strat Date")
    console.log("2023-04-26" > today, "End Date")
    console.log(time, "time")
    console.log("05:18" < time, time, "start time")
    console.log("20:17" > time, time, "end time")
    let day = ""
    if (currentDay == 0) {
      day = "sun"
    } else if (currentDay == 1) {
      day = "mon"
    } else if (currentDay == 2) {
      day = "tue"
    } else if (currentDay == 3) {
      day = "wed"
    } else if (currentDay == 4) {
      day = "thu"
    } else if (currentDay == 5) {
      day = "fri"
    } else if (currentDay == 6) {
      day = "sat"
    }
    console.log({ day })

    const productDetails = await Product.aggregate([
      {
        $match: {
          apply: "earnCrop",
          mktOfferFor: "promo",
          market: true,
          $or: [
            { title: { $regex: req.query.search, $options: "i" } },
            // { description: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $lookup: {
          from: "business_croprules",
          localField: "user",
          foreignField: "businessId",
          as: "cropRules",
        },
      },
      { $unwind: "$cropRules" },
      {
        $lookup: {
          from: "business_bonuscrops",
          localField: "_id",
          foreignField: "bonusCropProducts.productId",
          as: "bonusCrops",
        },
      },

      {
        $lookup: {
          from: "business_happyhours",
          localField: "_id",
          foreignField: "happyHoursProducts.productId",
          as: "happyHours",
        },
      },

      {
        $lookup: {
          from: "business_services",
          localField: "user",
          foreignField: "businessId",
          as: "services",
        },
      },

      {
        $addFields: {
          ruleAppliedCrops: {
            $multiply: ["$croppoints", "$cropRules.cropPerAudCredit"],
          },
        },
      },
      {
        $addFields: {
          bonusCropsDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  {
                    $gt: [
                      today,
                      { $arrayElemAt: ["$bonusCrops.bonusCrop.fromDate", 0] },
                    ],
                  },
                  {
                    $lt: [
                      today,
                      { $arrayElemAt: ["$bonusCrops.bonusCrop.toDate", 0] },
                    ],
                  },
                  { $anyElementTrue: `$bonusCrops.bonusCropDays.${day}` },
                ],
              },
              then: { $sum: `$bonusCrops.bonusCropPercentage` },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          happyHoursDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  {
                    $lte: [
                      {
                        $arrayElemAt: [
                          "$happyHours.happyHoursDates.fromDate",
                          0,
                        ],
                      },
                      today,
                    ],
                  },
                  {
                    $gte: [
                      {
                        $arrayElemAt: ["$happyHours.happyHoursDates.toDate", 0],
                      },
                      today,
                    ],
                  },
                  {
                    $lte: [
                      {
                        $arrayElemAt: [
                          "$happyHours.happyHoursTime.startTime",
                          0,
                        ],
                      },
                      time,
                    ],
                  },
                  {
                    $gte: [
                      {
                        $arrayElemAt: ["$happyHours.happyHoursTime.endTime", 0],
                      },
                      time,
                    ],
                  },
                  { $anyElementTrue: `$happyHours.happyHoursDays.${day}` },
                ],
              },
              then: { $sum: "$happyHours.happyHoursPercentage" },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          happyHoursAndExtendBonusAddedPercentage: {
            $add: [
              "$bonusCropsDiscountPercentage",
              "$happyHoursDiscountPercentage",
            ],
          },
        },
      },
      {
        $addFields: {
          cropRulesWithBonus: {
            $cond: [
              { $eq: ["$happyHoursAndExtendBonusAddedPercentage", 0] },
              "$ruleAppliedCrops",
              {
                $add: [
                  "$ruleAppliedCrops",
                  {
                    $divide: [
                      {
                        $multiply: [
                          "$ruleAppliedCrops",
                          "$happyHoursAndExtendBonusAddedPercentage",
                        ],
                      },
                      100,
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          title: 1,
          originalPrice: 1,
          discount: 1,
          image: 1,
          price: 1,
          quantity: 1,
          crops: "$croppoints",
          description: 1,
          brand: 1,
          user: 1,
          customiseMsg: 1,
          user: 1,
          apply: 1,
          rating: 1,
          likes: 1,
          cropRules: { cropPerAudCredit: 1 },
          ruleAppliedCrops: "$ruleAppliedCrops",
          bonusCropsDiscountPercentage: "$bonusCropsDiscountPercentage",
          happyHoursDiscountPercentage: "$happyHoursDiscountPercentage",
          happyHoursAndExtendBonusAddedPercentage:
            "$happyHoursAndExtendBonusAddedPercentage",
          cropRulesWithBonus: "$cropRulesWithBonus",
          rating: 1,
          likes: 1,
          mktOfferFor: 1,
        },
      },
    ])
    // return res.json({ count: productDetails.length, productDetails })
    return productDetails
  } catch (error) {
    console.log(error)
  }
}

module.exports.getRedeemCropProducts = async (req, res) => {
  try {
    const dateTime = new Date()
    const sDate = dateTime.toISOString()
    const today = sDate.split("T")[0]
    const currentDay = dateTime.getDay()
    console.log("2023-04-13" < today, "Strat Date")
    console.log("2023-04-14" > today, "End Date")
    let day = ""
    if (currentDay == 0) {
      day = "sun"
    } else if (currentDay == 1) {
      day = "mon"
    } else if (currentDay == 2) {
      day = "tue"
    } else if (currentDay == 3) {
      day = "wed"
    } else if (currentDay == 4) {
      day = "thu"
    } else if (currentDay == 5) {
      day = "fri"
    } else if (currentDay == 6) {
      day = "sat"
    }
    console.log({ day })
    const productDetails = await Product.aggregate([
      {
        $match: {
          apply: "redeemCrop",
          mktOfferFor: "promo",
          market: true,
          $or: [
            { title: { $regex: req.query.search, $options: "i" } },
            // { description: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $lookup: {
          from: "business_croprules",
          localField: "user",
          foreignField: "businessId",
          as: "cropRules",
        },
      },
      {
        $lookup: {
          from: "business_slashredemptioncrops",
          localField: "_id",
          foreignField: "slashRedemptionProducts.productId",
          as: "slashRedemption",
        },
      },
      {
        $lookup: {
          from: "business_otherservices",
          localField: "user",
          foreignField: "businessId",
          as: "blueDay",
        },
      },
      { $unwind: "$cropRules" },
      {
        $addFields: {
          ruleAppliedCrops: {
            $multiply: ["$redeemCROPs", "$cropRules.cropPerAudDebit"],
          },
        },
      },

      {
        $addFields: {
          slashRedemptionDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  {
                    $gte: [
                      today,
                      {
                        $arrayElemAt: [
                          "$slashRedemption.slashRedemption.fromDate",
                          0,
                        ],
                      },
                    ],
                  },
                  {
                    $lte: [
                      today,
                      {
                        $arrayElemAt: [
                          "$slashRedemption.slashRedemption.toDate",
                          0,
                        ],
                      },
                    ],
                  },
                  {
                    $anyElementTrue: `$slashRedemption.slashRedemption.${day}`,
                  },
                ],
              },
              then: { $sum: `$slashRedemption.slashRedemptionPercentage` },
              else: 0,
            },
          },
        },
      },

      {
        $addFields: {
          blueDay: {
            $cond: {
              if: {
                $and: [
                  {
                    $anyElementTrue: `$blueDay.blueDay`,
                  },
                  {
                    $gte: [
                      today,
                      {
                        $arrayElemAt: ["$blueDay.blueDates.fromDate", 0],
                      },
                    ],
                  },
                  {
                    $lte: [
                      today,
                      {
                        $arrayElemAt: ["$blueDay.blueDates.toDate", 0],
                      },
                    ],
                  },
                  {
                    $anyElementTrue: `$blueDay.blueDays.${day}`,
                  },
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },

      {
        $addFields: {
          cropRulesWithSlashRedemption: {
            $cond: [
              { $eq: ["$slashRedemptionDiscountPercentage", 0] },
              "$ruleAppliedCrops",
              {
                $subtract: [
                  "$ruleAppliedCrops",
                  {
                    $divide: [
                      {
                        $multiply: [
                          "$ruleAppliedCrops",
                          "$slashRedemptionDiscountPercentage",
                        ],
                      },
                      100,
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $match: { blueDay: false },
      },
      {
        $project: {
          title: 1,
          originalPrice: 1,
          discount: 1,
          price: 1,
          quantity: 1,
          image: 1,
          rating: 1,
          likes: 1,
          bidPrice: 1,
          redeemCROPS: 1,
          user: 1,
          cropRules: { cropPerAudDebit: 1 },
          ruleAppliedCrops: "$ruleAppliedCrops",
          slashRedemptionDiscountPercentage: 1,
          cropRulesWithSlashRedemption: "$cropRulesWithSlashRedemption",
          market: 1,
          apply: 1,
          sector: 1,
          customiseMsg: 1,
          brand: 1,
          description: 1,
          mktOfferFor: 1,
          cropRulesWithBonus: 1,
        },
      },
    ])
    // res.json({ count: productDetails.length, productDetails })
    return productDetails
  } catch (error) {
    console.log(error)
  }
}

module.exports.uploadProductImages = async (req, res) => {
  try {
    const productId = req.params.productId
    const fileName = req.files[0].filename
    console.log(fileName, "fileName")
    await Product.findByIdAndUpdate(
      { _id: productId },
      { $push: { image: fileName } }
    )
    return res.status(200).send({ success: true })
  } catch (error) {
    console.log(error)
  }
}

module.exports.getProductImage = async (req, res) => {
  const id = req.params.id
  try {
    if (fs.existsSync(`./uploads/${id}`)) {
      fs.readFile(`./uploads/${id}`, function (err, data) {
        if (err) throw err
        else {
          res.end(data)
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports.getEarnProducts = async (req, res) => {
  const user = req.user.user.id
  console.log("one")
  try {
    const products = await Product.find({
      $and: [
        { user },
        {
          $or: [{ apply: "earnCrop" }, { apply: "both" }],
        },
      ],
    })
    return res.status(200).send({ products })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
      status: 500,
    })
  }
}

module.exports.getRedeemProducts = async (req, res) => {
  const user = req.user.user.id
  console.log("two")
  try {
    // return console.log("redeemp")
    const products = await Product.find({
      $and: [
        { user },
        {
          $or: [{ apply: "redeemCrop" }, { apply: "both" }],
        },
      ],
    })
    console.log(products)
    return res.status(200).send({ products })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
      status: 500,
    })
  }
}

module.exports.productComment = async (req, res) => {
  try {
    let token = req.headers.authorization
    const token_data = await Token.findOne({ token: token })
    req.body.details[0].user_id = token_data.user
    req.body.product_likes.user_id = token_data.user
    const comment = await productComment.find({
      product_id: req.body.product_id,
    })
    if (comment.length == 0) {
      const newProductComment = new productComment(req.body)
      await newProductComment.save()
      res.status(200).json({
        message: "Product Comment Added Successfully",
        newProductComment,
        status: 200,
      })
    } else {
      const newProductComment = await productComment.updateOne(
        { product_id: req.body.product_id },
        {
          $push: {
            details: {
              user_id: token_data.user._id.valueOf(),
              comment: req.body.details[0].comment,
              rating: req.body.details[0].rating,
            },
            product_likes: {
              like: req.body.product_likes.like,
              user_id: token_data.user._id.valueOf(),
            },
          },
        }
      )
      res.status(200).json({
        message: "Product Comment Added Successfully",
        newProductComment,
        status: 200,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
      status: 500,
    })
  }
}

// db.products_comments.aggregate([
// {
//   $match: { product_id: ObjectId("641d8706a98f25b7232d3203") }
// },
// {
//   $project: {
//     name: {
//       $cond: {
//         if: {
//           $gt: [
//             { $size: { $filter: { input: "$product_likes", cond: { $and:[{$eq:["$$this.like",true]},{$eq: ["$$this.user_id", ObjectId("6433d23903a970bb517e5d7a")]}] } } } },
//             0
//           ]
//         },
//         then: "exists",
//         else: "No exists"
//       }
//     },
//     totalLikes:{$size:"$product_likes"}
//   }
// }
// ]);

module.exports.checkProductLike = async (req, res) => {
  try {
    const productId = req.query.id
    const token = req.headers.authorization
    const tokenData = await Token.findOne({ token })
    // const user_id=req.query.user;

    if (!tokenData) {
      return res.status(401).json({
        message: "Invalid token",
        status: 401,
      })
    }

    const data = await productComment.aggregate([
      {
        $match: { product_id: ObjectId(productId) },
      },
      {
        $project: {
          exists: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$product_likes",
                        cond: {
                          $and: [
                            { $eq: ["$$this.like", true] },
                            {
                              $eq: [
                                "$$this.user_id",
                                ObjectId(tokenData.user._id),
                              ],
                            },
                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              then: "true",
              else: "false",
            },
          },
          totalLikes: { $size: "$product_likes" },
        },
      },
    ])

    if (data.length === 0) {
      return res.status(200).json({
        message: "Product not found",
        data: [],
        status: 200,
      })
    }

    res.status(200).json({
      message: "Success",
      data,
      status: 200,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Internal server error",
      status: 500,
    })
  }
}

module.exports.putProductCommentLike = async (req, res) => {
  try {
    let token = req.headers.authorization
    const token_data = await Token.findOne({ token: token })
    // const id = req.body.id
    const product_id = req.body.product_id
    const user_id = token_data.user
    const like = req.body.like
    const productFetch = await productComment.find({
      // _id: id,
      product_id: product_id,
    })
    if (productFetch.length == 0) {
      const newProductComment = await new productComment({
        product_id: req.body.product_id,
        details: {
          user_id: token_data.user._id.valueOf(),
        },
        product_likes: {
          like: req.body.like,
          user_id: token_data.user._id.valueOf(),
        },
      })
      await newProductComment.save()
      res.status(200).json({
        message: "Product Likes Created Successfully",
        newProductComment,
        status: 200,
      })
    } else {
      const comment = await productComment.find({
        product_id: product_id,
        product_likes: {
          $elemMatch: {
            user_id: user_id,
          },
        },
      })
      var newProductComment
      if (comment.length == 0) {
        newProductComment = await productComment.findByIdAndUpdate(
          { product_id: product_id },
          { $push: { product_likes: { like: like, user_id: user_id } } }
        )
        res.status(200).json({
          message: "Product Likes Created Successfully",
          newProductComment,
          status: 200,
        })
      } else {
        newProductComment = await productComment.findOneAndUpdate(
          {
            product_id: product_id,
            product_likes: {
              $elemMatch: {
                user_id: user_id,
              },
            },
          },
          { $set: { product_likes: { like: like, user_id: user_id } } }
        )
        res.status(200).json({
          message: "Product Likes Updated Successfully",
          newProductComment,
          status: 200,
        })
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
      status: 500,
    })
  }
}

module.exports.putProductCommentDetails = async (req, res) => {
  try {
    let token = req.headers.authorization
    const token_data = await Token.findOne({ token: token })
    const id = req.body.id
    const product_id = req.body.product_id
    const user_id = token_data.user
    const comment = req.body.comment
    const rating = req.body.rating
    const commentnew = await productComment.find({
      _id: id,
      product_id: product_id,
      details: {
        $elemMatch: {
          user_id: user_id,
        },
      },
    })
    var newProductComment
    if (commentnew.length == 0) {
      newProductComment = await productComment.findByIdAndUpdate(
        { _id: id, product_id: product_id },
        {
          $push: {
            details: { comment: comment, user_id: user_id, rating: rating },
          },
        }
      )
      res.status(200).json({
        message: "Product Comment Created Successfully",
        newProductComment,
        status: 200,
      })
    } else {
      newProductComment = await productComment.findOneAndUpdate(
        {
          _id: id,
          product_id: product_id,
          details: {
            $elemMatch: {
              user_id: user_id,
            },
          },
        },
        {
          $set: {
            details: { comment: comment, user_id: user_id, rating: rating },
          },
        }
      )
      res.status(200).json({
        message: "Product Comment Updated Successfully",
        newProductComment,
        status: 200,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
      status: 500,
    })
  }
}

module.exports.putProductCommentPaticularLike = async (req, res) => {
  try {
    let token = req.headers.authorization
    const token_data = await Token.findOne({ token: token })
    const id = req.body.id
    const product_id = req.body.product_id
    const detail_id = req.body.detail_id
    const user_id = token_data.user
    const like = req.body.like

    const commentnew = await productComment.find({
      _id: id,
      product_id: product_id,
      details: { $elemMatch: { _id: detail_id } },
      "details.likes": { $elemMatch: { user_id: user_id } },
    })
    var newProductComment
    if (commentnew.length == 0) {
      newProductComment = await productComment.findOneAndUpdate(
        {
          _id: id,
          product_id: product_id,
          details: { $elemMatch: { _id: detail_id } },
        },
        { $push: { "details.$.likes": { like: like, user_id: user_id } } }
      )
      res.status(200).json({
        message: "Product Comment Like Created Successfully",
        newProductComment,
        status: 200,
      })
    } else {
      newProductComment = await productComment.findOneAndUpdate(
        {
          _id: id,
          product_id: product_id,
          details: { $elemMatch: { _id: detail_id } },
          "details.likes": { $elemMatch: { user_id: user_id } },
        },
        { $set: { "details.$.likes": { like: like, user_id: user_id } } }
      )
      res.status(200).json({
        message: "Product Comment Like Updated Successfully",
        newProductComment,
        status: 200,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
      status: 500,
    })
  }
}

module.exports.deleteProductComment = async (req, res) => {
  try {
    const newProductComment = await productComment.findByIdAndDelete({
      _id: id,
    })
    res.status(200).json({
      message: "Product Comment Deleted Successfully",
      newProductComment,
      status: 200,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
      status: 500,
    })
  }
}

module.exports.getProductComment = async (req, res) => {
  const user = req.user.user.id
  const product_id = req.query.product_id
  try {
    const newProductComment = await productComment.find({
      $and: [
        { status: "active" },
        { user_id: user },
        { product_id: product_id },
      ],
    })
    res
      .status(200)
      .json({ message: "Product Comment Get", newProductComment, status: 200 })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message,
      status: 500,
    })
  }
}

module.exports.getEarnCropProductsBySector = async (req, res) => {
  const { productTab, sector, pageNo, limit } = req.params
  try {
    const dateTime = new Date()
    const sDate = dateTime.toISOString()
    const today = sDate.split("T")[0]
    const currentDay = dateTime.getDay()
    const t = dateTime.toLocaleString("en-GB").split(" ")
    const th = t[1].split(":")
    const time = th[0] + ":" + th[1]
    console.log({ time })
    let day = ""
    console.log({ today })
    if (currentDay == 0) {
      day = "sun"
    } else if (currentDay == 1) {
      day = "mon"
    } else if (currentDay == 2) {
      day = "tue"
    } else if (currentDay == 3) {
      day = "wed"
    } else if (currentDay == 4) {
      day = "thu"
    } else if (currentDay == 5) {
      day = "fri"
    } else if (currentDay == 6) {
      day = "sat"
    }

    let match = []
    if (productTab == "mostPopular") {
      match = [
        { apply: "earnCrop" },
        { sector },
        { mktOfferFor: "topRank" },
        { market: true },
      ]
    }
    if (productTab == "bestRated") {
      match = [{ apply: "earnCrop" }, { sector }, { mktOfferFor: "topRank" }]
    }
    if (productTab == "nearMe") {
      const geocoder = NodeGeocoder({
        provider: "openstreetmap",
      })
      const lat = parseFloat(req.params.lat)
      const long = parseFloat(req.params.long)
      console.log({ lat }, { long })
      let city = ""
      await geocoder
        .reverse({ lat, lon: long })
        .then(res => {
          city = res[0].city
          console.log(city)
        })
        .catch(err => {
          console.error(err)
        })
      match = [
        { apply: "earnCrop" },
        { sector },
        { mktOfferFor: "topRank" },
        { city },
      ]
    }
    console.log("Santhosh", req.query.search)
    const page = pageNo ? parseInt(pageNo, 10) : 1
    const lim = limit ? parseInt(limit, 10) : 10
    console.log({ match })
    const productDetails = await Product.aggregate([
      {
        $match: {
          $and: match,
          $or: [
            { title: { $regex: req.query.search, $options: "i" } },
            // { description: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: {
          bidPrice: -1,
          rating: -1,
          likes: -1,
        },
      },
      {
        $lookup: {
          from: "business_croprules",
          localField: "user",
          foreignField: "businessId",
          as: "cropRules",
        },
      },
      { $unwind: "$cropRules" },
      {
        $lookup: {
          from: "business_bonuscrops",
          localField: "_id",
          foreignField: "bonusCropProducts.productId",
          as: "bonusCrops",
        },
      },

      {
        $lookup: {
          from: "business_happyhours",
          localField: "_id",
          foreignField: "happyHoursProducts.productId",
          as: "happyHours",
        },
      },

      {
        $lookup: {
          from: "business_services",
          localField: "user",
          foreignField: "businessId",
          as: "services",
        },
      },

      {
        $addFields: {
          ruleAppliedCrops: {
            $multiply: ["$croppoints", "$cropRules.cropPerAudCredit"],
          },
        },
      },
      {
        $addFields: {
          bonusCropsDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  {
                    $gte: [
                      today,
                      { $arrayElemAt: ["$bonusCrops.bonusCrop.fromDate", 0] },
                    ],
                  },
                  {
                    $lte: [
                      today,
                      { $arrayElemAt: ["$bonusCrops.bonusCrop.toDate", 0] },
                    ],
                  },
                  { $anyElementTrue: `$bonusCrops.bonusCropDays.${day}` },
                ],
              },
              then: { $sum: `$bonusCrops.bonusCropPercentage` },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          happyHoursDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  {
                    $lte: [
                      {
                        $arrayElemAt: [
                          "$happyHours.happyHoursDates.fromDate",
                          0,
                        ],
                      },
                      today,
                    ],
                  },
                  {
                    $gte: [
                      {
                        $arrayElemAt: ["$happyHours.happyHoursDates.toDate", 0],
                      },
                      today,
                    ],
                  },
                  {
                    $lte: [
                      {
                        $arrayElemAt: [
                          "$happyHours.happyHoursTime.startTime",
                          0,
                        ],
                      },
                      time,
                    ],
                  },
                  {
                    $gte: [
                      {
                        $arrayElemAt: ["$happyHours.happyHoursTime.endTime", 0],
                      },
                      time,
                    ],
                  },
                  { $anyElementTrue: `$happyHours.happyHoursDays.${day}` },
                ],
              },
              then: { $sum: "$happyHours.happyHoursPercentage" },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          happyHoursAndExtendBonusAddedPercentage: {
            $add: [
              "$bonusCropsDiscountPercentage",
              "$happyHoursDiscountPercentage",
            ],
          },
        },
      },
      {
        $addFields: {
          cropRulesWithBonus: {
            $cond: [
              { $eq: ["$happyHoursAndExtendBonusAddedPercentage", 0] },
              "$ruleAppliedCrops",
              {
                $add: [
                  "$ruleAppliedCrops",
                  {
                    $divide: [
                      {
                        $multiply: [
                          "$ruleAppliedCrops",
                          "$happyHoursAndExtendBonusAddedPercentage",
                        ],
                      },
                      100,
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          title: 1,
          originalPrice: 1,
          discount: 1,
          price: 1,
          quantity: 1,
          image: 1,
          rating: 1,
          likes: 1,
          bidPrice: 1,
          brand: 1,
          shortDescription: 1,
          description: 1,
          user: 1,
          customiseMsg: 1,
          crops: "$croppoints",
          cropRules: { cropPerAudCredit: 1 },
          ruleAppliedCrops: "$ruleAppliedCrops",
          bonusCropsDiscountPercentage: "$bonusCropsDiscountPercentage",
          happyHoursDiscountPercentage: "$happyHoursDiscountPercentage",
          buyOneGetOne: { $arrayElemAt: ["$happyHours.buyOneGetOne", 0] },
          discountVoucher: { $arrayElemAt: ["$happyHours.discountVoucher", 0] },
          happyHoursAndExtendBonusAddedPercentage:
            "$happyHoursAndExtendBonusAddedPercentage",
          cropRulesWithBonus: "$cropRulesWithBonus",
          happyHours: 1,
          services: { $arrayElemAt: ["$services", 0] },
          market: 1,
          apply: 1,
          sector: 1,
          mktOfferFor: 1,
        },
      },
      {
        $skip: (page - 1) * lim,
      },
      {
        $limit: lim,
      },
    ])
    const countResults = await Product.aggregate([
      { $match: { $and: match } },
      { $count: "count" },
    ])
    let dataArray = []
    for (let i = 0; i < productDetails.length; i++) {
      const countLikeResults = await productComment.find({
        product_id: productDetails[i]._id,
        product_likes: {
          $elemMatch: {
            like: true,
            status: true,
          },
        },
      })
      if (countLikeResults.length != 0) {
        const token = req.headers.authorization
        if (token == null || token == undefined) {
          const cartnew = await Cart.find({
            cart: { $elemMatch: { _id: productDetails[i]._id } },
          })
          if (cartnew.length == 0) {
            dataArray.push({
              ...productDetails[i],
              ...{ likes: countLikeResults.length, statusCart: 0 },
            })
          } else {
            dataArray.push({
              ...productDetails[i],
              ...{ likes: countLikeResults.length, statusCart: 1 },
            })
          }
        } else {
          const token_data = await Token.findOne({ token })
          console.log({ token_data })
          const cartnew = await Cart.find({
            user_id: token_data.user,
            cart: { $elemMatch: { _id: productDetails[i]._id } },
          })
          if (cartnew.length == 0) {
            dataArray.push({
              ...productDetails[i],
              ...{ likes: countLikeResults.length, statusCart: 0 },
            })
          } else {
            dataArray.push({
              ...productDetails[i],
              ...{ likes: countLikeResults.length, statusCart: 1 },
            })
          }
        }
      } else {
        dataArray.push({ ...productDetails[i], ...{ likes: 0, statusCart: 0 } })
      }
    }

    const count = countResults.length > 0 ? countResults[0].count : 0
    console.log({ countResults })
    res.json({ count, products: dataArray })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

module.exports.getRedeemCropProductsBySector = async (req, res) => {
  const { productTab, sector, pageNo, limit } = req.params
  try {
    const dateTime = new Date()
    const sDate = dateTime.toISOString()
    const today = sDate.split("T")[0]
    const currentDay = dateTime.getDay()
    console.log("2023-04-13" < today, "Strat Date")
    console.log("2023-04-14" > today, "End Date")
    let day = ""
    if (currentDay == 0) {
      day = "sun"
    } else if (currentDay == 1) {
      day = "mon"
    } else if (currentDay == 2) {
      day = "tue"
    } else if (currentDay == 3) {
      day = "wed"
    } else if (currentDay == 4) {
      day = "thu"
    } else if (currentDay == 5) {
      day = "fri"
    } else if (currentDay == 6) {
      day = "sat"
    }
    let match = []
    if (productTab == "mostPopular") {
      match = [
        { apply: "redeemCrop" },
        { sector },
        { mktOfferFor: "topRank" },
        { market: true },
      ]
    }
    if (productTab == "bestRated") {
      match = [{ apply: "redeemCrop" }, { mktOfferFor: "topRank" }, { sector }]
    }
    if (productTab == "nearMe") {
      const geocoder = NodeGeocoder({
        provider: "openstreetmap",
      })
      const lat = parseFloat(req.params.lat)
      const long = parseFloat(req.params.long)
      console.log({ lat }, { long })
      let city = ""
      await geocoder
        .reverse({ lat, lon: long })
        .then(res => {
          city = res[0].city
          console.log(city)
        })
        .catch(err => {
          console.error(err)
        })
      match = [
        { apply: "redeemCrop" },
        { sector },
        { mktOfferFor: "topRank" },
        { city },
      ]
    }
    const page = pageNo ? parseInt(pageNo, 10) : 1
    const lim = limit ? parseInt(limit, 10) : 10
    console.log({ productTab }, "two")
    console.log({ page }, "page")
    console.log({ lim }, "limit")
    const productDetails = await Product.aggregate([
      {
        $match: {
          $and: match,
          $or: [
            { title: { $regex: req.query.search, $options: "i" } },
            // { description: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: {
          bidPrice: -1,
          rating: -1,
          likes: -1,
        },
      },
      {
        $lookup: {
          from: "business_croprules",
          localField: "user",
          foreignField: "businessId",
          as: "cropRules",
        },
      },
      {
        $lookup: {
          from: "business_slashredemptioncrops",
          localField: "_id",
          foreignField: "slashRedemptionProducts.productId",
          as: "slashRedemption",
        },
      },
      {
        $lookup: {
          from: "business_services",
          localField: "user",
          foreignField: "businessId",
          as: "services",
        },
      },
      {
        $lookup: {
          from: "business_otherservices",
          localField: "user",
          foreignField: "businessId",
          as: "blueDay",
        },
      },
      { $unwind: "$cropRules" },
      {
        $addFields: {
          ruleAppliedCrops: {
            $multiply: ["$redeemCROPs", "$cropRules.cropPerAudDebit"],
          },
        },
      },

      {
        $addFields: {
          slashRedemptionDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  {
                    $gte: [
                      today,
                      {
                        $arrayElemAt: [
                          "$slashRedemption.slashRedemption.fromDate",
                          0,
                        ],
                      },
                    ],
                  },
                  {
                    $lte: [
                      today,
                      {
                        $arrayElemAt: [
                          "$slashRedemption.slashRedemption.toDate",
                          0,
                        ],
                      },
                    ],
                  },
                  {
                    $anyElementTrue: `$slashRedemption.slashRedemptionDays.${day}`,
                  },
                ],
              },
              then: { $sum: `$slashRedemption.slashRedemptionPercentage` },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          blueDay: {
            $cond: {
              if: {
                $and: [
                  {
                    $anyElementTrue: `$blueDay.blueDay`,
                  },
                  {
                    $gte: [
                      today,
                      {
                        $arrayElemAt: ["$blueDay.blueDates.fromDate", 0],
                      },
                    ],
                  },
                  {
                    $lte: [
                      today,
                      {
                        $arrayElemAt: ["$blueDay.blueDates.toDate", 0],
                      },
                    ],
                  },
                  {
                    $anyElementTrue: `$blueDay.blueDays.${day}`,
                  },
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $addFields: {
          cropRulesWithBonus: 0,
        },
      },
      {
        $match: { blueDay: false },
      },
      {
        $project: {
          title: 1,
          originalPrice: 1,
          discount: 1,
          price: 1,
          croppoints: 1,
          quantity: 1,
          image: 1,
          rating: 1,
          likes: 1,
          bidPrice: 1,
          user: 1,
          cropRules: { cropPerAudDebit: 1 },
          ruleAppliedCrops: "$ruleAppliedCrops",
          slashRedemptionDiscountPercentage: 1,
          cropRulesWithSlashRedemption: "$cropRulesWithSlashRedemption",
          slashRedemption: 1,
          market: 1,
          apply: 1,
          sector: 1,
          services: { $arrayElemAt: ["$services", 0] },
          customiseMsg: 1,
          brand: 1,
          shortDescription: 1,
          description: 1,
          mktOfferFor: 1,
          cropRulesWithBonus: 1,
        },
      },
      {
        $skip: (page - 1) * lim,
      },
      {
        $limit: lim,
      },
    ])
    const countResults = await Product.aggregate([
      { $match: { $and: match } },
      { $count: "count" },
    ])
    let dataArray = []
    for (let i = 0; i < productDetails.length; i++) {
      const countLikeResults = await productComment.find({
        product_id: productDetails[i]._id,
        product_likes: {
          $elemMatch: {
            like: true,
            status: true,
          },
        },
      })
      if (countLikeResults.length != 0) {
        const token = req.headers.authorization
        const token_data = await Token.findOne({ token })
        const cartnew = await Cart.find({
          user_id: token_data.user,
          cart: { $elemMatch: { _id: productDetails[i]._id } },
        })
        if (cartnew.length == 0) {
          dataArray.push({
            ...productDetails[i],
            ...{ likes: countLikeResults.length, statusCart: 0 },
          })
        } else {
          dataArray.push({
            ...productDetails[i],
            ...{ likes: countLikeResults.length, statusCart: 1 },
          })
        }
      } else {
        dataArray.push({ ...productDetails[i], ...{ likes: 0, statusCart: 0 } })
      }
    }
    const count = countResults.length > 0 ? countResults[0].count : 0
    res.json({ count, products: dataArray })
  } catch (error) {
    console.log(error)
  }
}

module.exports.getBiddedProductsByBusiness = async (req, res) => {
  console.log("api triggering")
  const user = req.user.user.id
  const bid = true
  console.log(user)
  try {
    const biddedProducts = await Product.find({ user, bid }).select("-status")
    return res.status(200).send({ success: true, biddedProducts })
  } catch (error) {
    console.log(error)
  }
}

module.exports.getBiddingSelectedProductsDetailsByBusiness = async (
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

module.exports.getPromoProducts = async (req, res) => {
  const page = req.params.page // current page number
  const limit = req.params.limit // number of documents per page

  const skip = (page - 1) * limit
  try {
    const promoProducts = await Product.find({
      mktOfferFor: "promo",
      market: true,
    })
      .skip(skip)
      .limit(limit)
    const count = await await Product.find({
      mktOfferFor: "promo",
      market: true,
    }).countDocuments()
    return res.status(200).send({ count, promoProducts })
  } catch (error) {
    conosle.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

module.exports.getAllProducts = async (req, res) => {
  const page = req.params.page // current page number
  const limit = req.params.limit // number of documents per page

  const skip = (page - 1) * limit
  try {
    const products = await Product.find({}).skip(skip).limit(limit)
    const count = await Product.find({}).countDocuments()
    return res.status(200).send({ count, products })
  } catch (error) {
    return res.status(500).send("Internal Server Error")
  }
}

module.exports.getEarnCropSingleProductById = async (req, res) => {
  try {
    const dateTime = new Date()
    const sDate = dateTime.toISOString()
    const today = sDate.split("T")[0]
    // console.log(dateTime.getDay(), "day");
    const currentDay = dateTime.getDay()
    const t = dateTime.toLocaleString("en-GB").split(" ")
    const th = t[1].split(":")
    const time = th[0] + ":" + th[1]
    if (currentDay == 0) {
      day = "sun"
    } else if (currentDay == 1) {
      day = "mon"
    } else if (currentDay == 2) {
      day = "tue"
    } else if (currentDay == 3) {
      day = "wed"
    } else if (currentDay == 4) {
      day = "thu"
    } else if (currentDay == 5) {
      day = "fri"
    } else if (currentDay == 6) {
      day = "sat"
    }
    const id = req.params.id

    const product = await Product.aggregate([
      { $match: { _id: { $eq: ObjectId(id) } } },
      {
        $lookup: {
          from: "business_croprules",
          localField: "user",
          foreignField: "businessId",
          as: "cropRules",
        },
      },
      { $unwind: "$cropRules" },
      {
        $lookup: {
          from: "business_bonuscrops",
          localField: "_id",
          foreignField: "bonusCropProducts.productId",
          as: "bonusCrops",
        },
      },

      {
        $lookup: {
          from: "business_happyhours",
          localField: "_id",
          foreignField: "happyHoursProducts.productId",
          as: "happyHours",
        },
      },

      {
        $lookup: {
          from: "business_services",
          localField: "user",
          foreignField: "businessId",
          as: "services",
        },
      },

      {
        $addFields: {
          ruleAppliedCrops: {
            $multiply: ["$croppoints", "$cropRules.cropPerAudCredit"],
          },
        },
      },
      {
        $addFields: {
          bonusCropsDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  {
                    $gte: [
                      today,
                      { $arrayElemAt: ["$bonusCrops.bonusCrop.fromDate", 0] },
                    ],
                  },
                  {
                    $lte: [
                      today,
                      { $arrayElemAt: ["$bonusCrops.bonusCrop.toDate", 0] },
                    ],
                  },
                  { $anyElementTrue: `$bonusCrops.bonusCropDays.${day}` },
                ],
              },
              then: { $sum: `$bonusCrops.bonusCropPercentage` },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          happyHoursDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  {
                    $lte: [
                      {
                        $arrayElemAt: [
                          "$happyHours.happyHoursDates.fromDate",
                          0,
                        ],
                      },
                      today,
                    ],
                  },
                  {
                    $gte: [
                      {
                        $arrayElemAt: ["$happyHours.happyHoursDates.toDate", 0],
                      },
                      today,
                    ],
                  },
                  {
                    $lte: [
                      {
                        $arrayElemAt: [
                          "$happyHours.happyHoursTime.startTime",
                          0,
                        ],
                      },
                      time,
                    ],
                  },
                  {
                    $gte: [
                      {
                        $arrayElemAt: ["$happyHours.happyHoursTime.endTime", 0],
                      },
                      time,
                    ],
                  },
                  { $anyElementTrue: `$happyHours.happyHoursDays.${day}` },
                ],
              },
              then: { $sum: "$happyHours.happyHoursPercentage" },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          happyHoursAndExtendBonusAddedPercentage: {
            $add: [
              "$bonusCropsDiscountPercentage",
              "$happyHoursDiscountPercentage",
            ],
          },
        },
      },

      {
        $addFields: {
          cropRulesWithBonus: {
            $cond: [
              { $eq: ["$happyHoursAndExtendBonusAddedPercentage", 0] },
              "$ruleAppliedCrops",
              {
                $add: [
                  "$ruleAppliedCrops",
                  {
                    $divide: [
                      {
                        $multiply: [
                          "$ruleAppliedCrops",
                          "$happyHoursAndExtendBonusAddedPercentage",
                        ],
                      },
                      100,
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          title: 1,
          originalPrice: 1,
          discount: 1,
          price: 1,
          quantity: 1,
          image: 1,
          likes: 1,
          bidPrice: 1,
          brand: 1,
          shortDescription: 1,
          description: 1,
          user: 1,
          customiseMsg: 1,
          crops: "$croppoints",
          cropRules: { cropPerAudCredit: 1 },
          ruleAppliedCrops: "$ruleAppliedCrops",
          bonusCropsDiscountPercentage: "$bonusCropsDiscountPercentage",
          happyHoursDiscountPercentage: "$happyHoursDiscountPercentage",
          happyHoursAndExtendBonusAddedPercentage:
            "$happyHoursAndExtendBonusAddedPercentage",
          cropRulesWithBonus: "$cropRulesWithBonus",
          buyOneGetOne: { $arrayElemAt: ["$happyHours.buyOneGetOne", 0] },
          discountVoucher: { $arrayElemAt: ["$happyHours.discountVoucher", 0] },
          bonusCrops: 1,
          happyHours: 1,
          services: { $arrayElemAt: ["$services", 0] },
          market: 1,
          apply: 1,
          sector: 1,
          mktOfferFor: 1,
        },
      },
    ])
    res.status(200).send({ product: product[0] })
  } catch (error) {
    console.log(error)
  }
}

module.exports.getRedeemCropSingleProductById = async (req, res) => {
  try {
    const dateTime = new Date()
    const sDate = dateTime.toISOString()
    const today = sDate.split("T")[0]
    const currentDay = dateTime.getDay()
    console.log("2023-04-13" < today, "Strat Date")
    console.log("2023-04-14" > today, "End Date")
    let day = ""
    if (currentDay == 0) {
      day = "sun"
    } else if (currentDay == 1) {
      day = "mon"
    } else if (currentDay == 2) {
      day = "tue"
    } else if (currentDay == 3) {
      day = "wed"
    } else if (currentDay == 4) {
      day = "thu"
    } else if (currentDay == 5) {
      day = "fri"
    } else if (currentDay == 6) {
      day = "sat"
    }
    const id = req.params.id
    console.log({ id })
    const product = await Product.aggregate([
      { $match: { _id: { $eq: ObjectId(id) } } },
      {
        $sort: {
          bidPrice: -1,
          rating: -1,
          likes: -1,
        },
      },
      {
        $lookup: {
          from: "business_croprules",
          localField: "user",
          foreignField: "businessId",
          as: "cropRules",
        },
      },
      {
        $lookup: {
          from: "business_slashredemptioncrops",
          localField: "_id",
          foreignField: "slashRedemptionProducts.productId",
          as: "slashRedemption",
        },
      },
      { $unwind: "$cropRules" },
      {
        $addFields: {
          ruleAppliedCrops: {
            $multiply: ["$redeemCROPs", "$cropRules.cropPerAudDebit"],
          },
        },
      },

      {
        $addFields: {
          slashRedemptionDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  {
                    $gte: [
                      today,
                      {
                        $arrayElemAt: [
                          "$slashRedemption.slashRedemption.fromDate",
                          0,
                        ],
                      },
                    ],
                  },
                  {
                    $lte: [
                      today,
                      {
                        $arrayElemAt: [
                          "$slashRedemption.slashRedemption.toDate",
                          0,
                        ],
                      },
                    ],
                  },
                  {
                    $anyElementTrue: `$slashRedemption.slashRedemptionDays.${day}`,
                  },
                ],
              },
              then: { $sum: `$slashRedemption.slashRedemptionPercentage` },
              else: 0,
            },
          },
        },
      },

      {
        $addFields: {
          cropRulesWithSlashRedemption: {
            $cond: [
              { $eq: ["$slashRedemptionDiscountPercentage", 0] },
              "$ruleAppliedCrops",
              {
                $subtract: [
                  "$ruleAppliedCrops",
                  {
                    $divide: [
                      {
                        $multiply: [
                          "$ruleAppliedCrops",
                          "$slashRedemptionDiscountPercentage",
                        ],
                      },
                      100,
                    ],
                  },
                ],
              },
            ],
          },
        },
      },

      {
        $project: {
          title: 1,
          originalPrice: 1,
          discount: 1,
          price: 1,
          quantity: 1,
          image: 1,
          rating: 1,
          redeemCROPs: 1,
          likes: 1,
          bidPrice: 1,
          user: 1,
          cropRules: { cropPerAudDebit: 1 },
          ruleAppliedCrops: "$ruleAppliedCrops",
          slashRedemptionDiscountPercentage: 1,
          slashRedemption: 1,
          cropRulesWithSlashRedemption: "$cropRulesWithSlashRedemption",
          customiseMsg: 1,
          brand: 1,
          shortDescription: 1,
          description: 1,
          mktOfferFor: 1,
          apply: 1,
          rating: 1,
          likes: 1,
          sector: 1,
        },
      },
    ])
    res.json({ product: product[0] })
  } catch (error) {
    console.log(error.message)
  }
}

module.exports.getPromoProductsByBusiness = async (req, res) => {
  const user = req.user.user.id
  console.log({ user })
  try {
    const promoProducts = await Product.find({
      user,
      mktOfferFor: "promo",
      // market: true,
    })
    return res.status(200).send({ promoProducts })
  } catch (error) {
    conosle.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

module.exports.getProductCommentAndRatingsByBusiness = async (req, res) => {
  const { productId } = req.params
  try {
    const productCommentsAndRatings = await productComment.aggregate([
      { $match: { product_id: ObjectId(productId) } },
      { $unwind: "$details" },
      {
        $lookup: {
          from: "users_customers",
          localField: "details.user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "business_products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $unwind: "$user",
      },
      {
        $group: {
          _id: "$_id",
          details: {
            $push: {
              // user_id: "$details.user_id",
              comment: "$details.comment",
              rating: "$details.rating",
              // status: "$details.status",
              _id: "$details._id",
              user: "$user.name",
              profilePic: "$user.avatar",
              createdAt: "$details.createdAt",
            },
          },
          product: { $first: "$product" },
          averageRating: { $avg: "$details.rating" },
        },
      },
    ])
    return res.status(200).send(productCommentsAndRatings[0])
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

module.exports.getPromoEarnAndRedeemProducts = async (req, res) => {
  try {
    const page = Number(req.params.page)
    const limit = Number(req.params.limit)
    console.log(typeof page, page, "page")
    console.log(typeof limit, limit, "limit")
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const earnCropProducts = await this.getEarnCropProducts(req, res)
    const redeemCropProducts = await this.getRedeemCropProducts(req, res)
    let promoProducts = []
    if (redeemCropProducts.length != 0) {
      promoProducts = earnCropProducts.concat(redeemCropProducts)
    } else {
      promoProducts = earnCropProducts
    }
    const promoProductsWithLimit = promoProducts.slice(startIndex, endIndex)
    console.log({ startIndex, endIndex })
    return res.status(200).send({
      count: promoProducts.length,
      promoProducts: promoProductsWithLimit,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

module.exports.getEarnAndRedeemProducts = async (req, res) => {
  try {
    const dateTime = new Date()
    const sDate = dateTime.toISOString()
    const today = sDate.split("T")[0]
    // console.log(dateTime.getDay(), "day");
    const currentDay = dateTime.getDay()
    const t = dateTime.toLocaleString("en-GB").split(" ")
    const th = t[1].split(":")
    const time = th[0] + ":" + th[1]
    if (currentDay == 0) {
      day = "sun"
    } else if (currentDay == 1) {
      day = "mon"
    } else if (currentDay == 2) {
      day = "tue"
    } else if (currentDay == 3) {
      day = "wed"
    } else if (currentDay == 4) {
      day = "thu"
    } else if (currentDay == 5) {
      day = "fri"
    } else if (currentDay == 6) {
      day = "sat"
    }
    const id = req.params.id
    const product = await Product.aggregate([
      { $match: { _id: { $eq: ObjectId(id) } } },
      {
        $lookup: {
          from: "business_croprules",
          localField: "user",
          foreignField: "businessId",
          as: "cropRules",
        },
      },
      { $unwind: "$cropRules" },
      {
        $lookup: {
          from: "business_slashredemptioncrops",
          localField: "_id",
          foreignField: "slashRedemptionProducts.productId",
          as: "slashRedemption",
        },
      },
      {
        $lookup: {
          from: "business_bonuscrops",
          localField: "_id",
          foreignField: "bonusCropProducts.productId",
          as: "bonusCrops",
        },
      },

      {
        $lookup: {
          from: "business_happyhours",
          localField: "_id",
          foreignField: "happyHoursProducts.productId",
          as: "happyHours",
        },
      },

      {
        $lookup: {
          from: "business_slashredemptioncrops",
          localField: "_id",
          foreignField: "slashRedemptionProducts.productId",
          as: "slashRedemption",
        },
      },

      {
        $lookup: {
          from: "business_services",
          localField: "user",
          foreignField: "businessId",
          as: "services",
        },
      },

      {
        $addFields: {
          earnRuleAppliedCrops: {
            $multiply: ["$croppoints", "$cropRules.cropPerAudCredit"],
          },
        },
      },
      {
        $addFields: {
          redeemRuleAppliedCrops: {
            $multiply: ["$redeemCROPs", "$cropRules.cropPerAudDebit"],
          },
        },
      },

      {
        $addFields: {
          slashRedemptionDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  {
                    $lte: ["2023-05-10", today],
                  },
                  {
                    $gte: ["2023-05-29", today],
                  },
                  {
                    $eq: [true, true],
                  },
                ],
              },
              then: 10,
              else: 0,
            },
          },
        },
      },

      {
        $addFields: {
          bonusCropsDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  [{ $lte: ["$bonusCrops.bonusCrop.fromDate", today] }],
                  [{ $gte: ["$bonusCrops.bonusCrop.toDate", today] }],
                  [`$bonusCrops.bonusCropDays.${day}`],
                ],
              },
              then: { $sum: `$bonusCrops.bonusCropPercentage` },
              else: [`$bonusCrops.bonusCropDays.${day}`, day],
            },
          },
        },
      },
      {
        $addFields: {
          happyHoursDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  [{ $lte: ["$happyHours.happyHoursDates.fromDate", today] }],
                  [{ $gte: ["$happyHours.happyHoursDates.toDate", today] }],
                  [`$happyHours.happyHoursDays.${day}`],
                  [{ $lte: ["$happyHours.happyHoursTime.startTime", time] }],
                  [{ $gte: ["$happyHours.happyHoursTime.endTime", time] }],
                ],
              },
              then: { $sum: "$happyHours.happyHoursPercentage" },
              else: [`$happyHours.happyHoursDay.${day}`, day],
            },
          },
        },
      },
      {
        $addFields: {
          happyHoursAndExtendBonusAddedPercentage: {
            $add: [
              "$bonusCropsDiscountPercentage",
              "$happyHoursDiscountPercentage",
            ],
          },
        },
      },

      {
        $addFields: {
          cropRulesWithBonus: {
            $cond: [
              { $eq: ["$happyHoursAndExtendBonusAddedPercentage", 0] },
              "$ruleAppliedCrops",
              {
                $add: [
                  "$ruleAppliedCrops",
                  {
                    $divide: [
                      {
                        $multiply: [
                          "$ruleAppliedCrops",
                          "$happyHoursAndExtendBonusAddedPercentage",
                        ],
                      },
                      100,
                    ],
                  },
                ],
              },
            ],
          },
        },
      },

      {
        $project: {
          title: 1,
          originalPrice: 1,
          discount: 1,
          image: 1,
          price: 1,
          quantity: 1,
          crops: "$croppoints",
          shortDescription: 1,
          description: 1,
          brand: 1,
          user: 1,
          customiseMsg: 1,
          user: 1,
          apply: 1,
          rating: 1,
          likes: 1,
          cropRules: { cropPerAudCredit: 1, cropPerAudDebit: 1 },
          buyOneGetOne: { $arrayElemAt: ["$happyHours.buyOneGetOne", 0] },
          discountVoucher: { $arrayElemAt: ["$happyHours.discountVoucher", 0] },
          earnRuleAppliedCrops: "$ruleAppliedCrops",
          bonusCropsDiscountPercentage: "$bonusCropsDiscountPercentage",
          happyHoursDiscountPercentage: "$happyHoursDiscountPercentage",
          happyHoursAndExtendBonusAddedPercentage:
            "$happyHoursAndExtendBonusAddedPercentage",
          cropRulesWithBonus: "$cropRulesWithBonus",
          rating: 1,
          likes: 1,
          mktOfferFor: 1,
          happyHours: 1,
          bonusCrops: 1,
          sector: 1,
          redeemCROPs: 1,
          redeemRuleAppliedCrops: "$ruleAppliedCrops",
          slashRedemptionDiscountPercentage: 1,
          slashRedemption: 1,
          cropRulesWithSlashRedemption: "$cropRulesWithSlashRedemption",
          customiseMsg: 1,
        },
      },
    ])
    res.status(200).send({ product: product[0] })
  } catch (error) {
    return res.status(500).send("Internal Server Error")
  }
}

module.exports.getAllProductCommentAndRatingsByBusiness = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const productCommentsAndRatings = await Product.aggregate([
      { $match: { user: ObjectId(businessId) } },
      {
        $lookup: {
          from: "products_comments",
          localField: "_id",
          foreignField: "product_id",
          as: "comments",
        },
      },
      { $unwind: "$comments" },
      { $unwind: "$comments.details" },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          image: { $first: "$image" },
          comment: {
            // $first: {
            $push: {
              _id: "$comments._id",
              product_id: "$comments.product_id",
              details: "$comments.details",
              product_likes: "$comments.product_likes",
              status: "$comments.status",
              createdAt: "$comments.createdAt",
              updatedAt: "$comments.updatedAt",
              __v: "$comments.__v",
            },
          },
          // },
          likes: { $first: "$comments.product_likes" },
          averageRating: { $avg: "$comments.details.rating" },
        },
      },
    ])
    return res.status(200).send(productCommentsAndRatings)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}
