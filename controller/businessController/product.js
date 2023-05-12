const fs = require("fs")
const {
  Product,
  productComment,
} = require("../../models/businessModel/product")
const { Token } = require("../../models/User");
const {
  adminPaymentTracker,
} = require("../../models/admin/PaymentTracker/paymentIdTracker")
const business = require("../../models/businessModel/business")
const NodeGeocoder = require("node-geocoder")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

// addAllProducts
module.exports.addProduct = async (req, res) => {
  try {
    console.log("user", req.user.user)
    const id = req.user.user.id
    const busi = await business.findById(id)
    req.body.user = id
    req.body.city = busi.address[0].city
    req.body.croppoints = req.body.price
    const newProduct = new Product(req.body)
    await newProduct.save()
    console.log(newProduct, "newProduct")
    res.status(200).send({
      message: "Product added successfully",
      productId: newProduct._id,
    })
  } catch (err) {
    res.status(500).send({
      message: err.message,
    })
  }
}
// addAllProducts

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

// getDiscountProduct
module.exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id })
    res.json(product)
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
    await Product.findByIdAndRemove({ _id: id })
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
  console.log("running")
  const user = req.user.user.id
  console.log("userID", user)
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
// End Sridhar

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
      { $match: { apply: "earnCrop" } },
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
                  // [`$happyHours.happyHoursDays.${day}`]
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
      // { $cond: [ { $eq: [ "$happyHoursAndExtendBonusAddedPercentage", 0 ] }, "$ruleAppliedCrops", {$divide:["$upvotes", "$downvotes"]} ] }
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
      // {$unwind: "$bonusCrops"},
      {
        $project: {
          title: 1,
          originalPrice: 1,
          discount: 1,
          price: 1,
          quantity: 1,
          crops: "$croppoints",
          cropRules: { cropPerAudCredit: 1 },
          ruleAppliedCrops: "$ruleAppliedCrops",
          bonusCropsDiscountPercentage: "$bonusCropsDiscountPercentage",
          happyHoursDiscountPercentage: "$happyHoursDiscountPercentage",
          happyHoursAndExtendBonusAddedPercentage:
            "$happyHoursAndExtendBonusAddedPercentage",
          cropRulesWithBonus: "$cropRulesWithBonus",
          happyHours: 1,
          services: { $arrayElemAt: ["$services", 0] },
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
    // console.log(dateTime.getDay(), "day");
    const currentDay = dateTime.getDay()
    // console.log(today, "today")
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
      { $match: { apply: "redeemCrop" } },
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
                    $lte: ["2023-05-10", today],
                  },
                  {
                    $gte: ["2023-05-20", today],
                  },
                  {
                    $eq: [true, true],
                  },
                ],
              },
              then: { $sum: `$slashRedemption.slashRedemptionPercentage` },
              else: 1,
            },
          },
        },
      },
      // {
      //   $lte: ["$slashRedemption.slashRedemption.fromDate", today],
      // },
      // {
      //   $gte: ["$slashRedemption.slashRedemption.toDate", today],
      // },
      // {
      //   $eq: [`$slashRedemption.slashRedemptionDays.tue`, true],
      // },
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
          quantity: 1,
          redeemCROPs: 1,
          user: 1,
          cropRules: { cropPerAudDebit: 1 },
          ruleAppliedCrops: "$ruleAppliedCrops",
          slashRedemptionDiscountPercentage: 1,
          cropRulesWithSlashRedemption: "$cropRulesWithSlashRedemption",
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
      await newProductComment.save();
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
            user_id: user_id
          }
        }
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
                user_id: user_id
              }
            }
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
          user_id: user_id
        }
      }
    })
    var newProductComment
    if (commentnew.product_likes.length == 0) {
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
        { _id: id, product_id: product_id, details: {
          $elemMatch: {
            user_id: user_id
          }
        } },
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
    const page = pageNo ? parseInt(pageNo, 10) : 1
    const lim = limit ? parseInt(limit, 10) : 10
    console.log({ match })
    const productDetails = await Product.aggregate([
      { $match: { $and: match } },
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
                  // [`$happyHours.happyHoursDays.${day}`]
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
      // { $cond: [ { $eq: [ "$happyHoursAndExtendBonusAddedPercentage", 0 ] }, "$ruleAppliedCrops", {$divide:["$upvotes", "$downvotes"]} ] }
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

      // {$unwind: "$bonusCrops"},
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
    let dataArray = [];
    for(let i=0; i<productDetails.length; i++){
      const countLikeResults = await productComment.aggregate([
        { $match: { $and: match, product_id: productDetails[i]._id, productLikes: {like: true, status: true} } },
        { $count: "count" },
      ])
      if (countLikeResults.length != 0){
        dataArray.push({...productDetails[i],...{likes: countLikeResults[0].count}})
      }
      else{
        dataArray.push({...productDetails[i],...{likes: 0}})
      }
      
    }
    
    const count = countResults.length > 0 ? countResults[0].count : 0
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
      { $match: { $and: match } },
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
                    $lte: ["2023-04-23", today],
                  },
                  {
                    $gte: ["2023-04-29", today],
                  },
                  {
                    $eq: [true, true],
                  },
                ],
              },
              then: { name: `$slashRedemption.slashRedemptionDays.${day}` },
              else: [`$slashRedemption.slashRedemptionDays.${day}`, day],
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
    let dataArray = [];
    for(let i=0; i<productDetails.length; i++){
      const countLikeResults = await productComment.aggregate([
        { $match: { $and: match, product_id: productDetails[i]._id, productLikes: {like: true, status: true} } },
        { $count: "count" },
      ])
      if (countLikeResults.length != 0){
        dataArray.push({...productDetails[i],...{likes: countLikeResults[0].count}})
      }
      else{
        dataArray.push({...productDetails[i],...{likes: 0}})
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
    const id = req.params.id.toString()
    console.log(typeof id)
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
                  // [`$happyHours.happyHoursDays.${day}`]
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
      // { $cond: [ { $eq: [ "$happyHoursAndExtendBonusAddedPercentage", 0 ] }, "$ruleAppliedCrops", {$divide:["$upvotes", "$downvotes"]} ] }
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
      // {$unwind: "$bonusCrops"},
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
          // services: 1,
          // happyHours: 1,
          // bonusCrops: 1,
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
                    $lte: ["2023-04-23", today],
                  },
                  {
                    $gte: ["2023-04-29", today],
                  },
                  {
                    $eq: [true, true],
                  },
                ],
              },
              then: { name: `$slashRedemption.slashRedemptionDays.${day}` },
              else: [`$slashRedemption.slashRedemptionDays.${day}`, day],
            },
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
          user: 1,
          cropRules: { cropPerAudDebit: 1 },
          ruleAppliedCrops: "$ruleAppliedCrops",
          slashRedemptionDiscountPercentage: 1,
          cropRulesWithSlashRedemption: "$cropRulesWithSlashRedemption",
          customiseMsg: 1,
          brand: 1,
          description: 1,
          mktOfferFor: 1,
          apply: 1,
          rating: 1,
          likes: 1,
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
      market: true,
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
      // {
      //   $addFields: {
      //     $add: [],
      //   },
      // },
      {
        $project: {
          productId: 1,
          details: 1,
          averageRating: {
            $divide: [
              {
                $reduce: {
                  input: "$details",
                  initialValue: 0,
                  in: { $add: ["$$value", "$$this.rating"] },
                },
              },
              { $size: "$details" },
            ],
          },
          likes: 1,
          productLikes: 1,
        },
      },
    ])
    return res
      .status(200)
      .send({ productCommentsAndRatings: productCommentsAndRatings[0] })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

module.exports.getPromoEarnAndRedeemProducts = async (req, res) => {
  try {
    const earnCropProducts = await this.getEarnCropProducts(req, res)
    const redeemCropProducts = await this.getRedeemCropProducts(req, res)
    // const promoProducts = await Product.find({})
    return res.status(200).send({ earnCropProducts, redeemCropProducts })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}
