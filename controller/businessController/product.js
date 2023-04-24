const fs = require("fs")
const {
  Product,
  productComment,
} = require("../../models/businessModel/product")
const {
  adminPaymentTracker,
} = require("../../models/admin/PaymentTracker/paymentIdTracker")

// addAllProducts
module.exports.addProduct = async (req, res) => {
  try {
    req.body.user = req.user.user.id
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

// module.exports.getProductsByCatagory = async (req, res) => {
//   console.log("etwt")
//   const {category} = req.body;
//   try {
//     let product = []
//     await category.map(async (cate) => {
//       let children = cate;
//       let products = await Product.find({children});
//       products.forEach(element => {
//         product.push(element)
//       })
//       return res.status(200).json({product})
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).send({
//       message: error.message
//     })
//   }
// }

// Start Sridhar

// Get Products By Category
// module.exports.getProductsByCatagory = async (req, res) => {
//   const { categoryId } = req.params;
//   console.log(req.body)
//   try {
//     const products = await Product.find({categoryId});
//     res.status(200).json({ products });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// };
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
    const products = await Product.find({ user })
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
    res.json({ count: productDetails.length, productDetails })
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
                    $lte: ["2023-04-10", today],
                  },
                  {
                    $gte: ["2023-04-16", today],
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
      // {
      //   $lte: ["$slashRedemption.slashRedemption.fromDate", today],
      // },
      // {
      //   $gte: ["$slashRedemption.slashRedemption.toDate", today],
      // },
      // {
      //   $eq: [`$slashRedemption.slashRedemptionDays.tue`, true],
      // },
      // {
      //   $addFields: {
      //     cropRulesWithSlashRedemption: {
      //       $cond: [
      //         { $eq: ["$slashRedemptionDiscountPercentage", 0] },
      //         "$ruleAppliedCrops",
      //         {
      //           $subtract: [
      //             "$ruleAppliedCrops",
      //             {
      //               $divide: [
      //                 {
      //                   $multiply: [
      //                     "$ruleAppliedCrops",
      //                     "$slashRedemptionDiscountPercentage",
      //                   ],
      //                 },
      //                 100,
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   },
      // },
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
    res.json({ count: productDetails.length, productDetails })
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
    const newProductComment = new productComment(req.body)
    await newProductComment.save()
    res.status(200).json({
      message: "Product Comment Added Successfully",
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

module.exports.putProductComment = async (req, res) => {
  try {
    const id = req.body._id
    const newProductComment = await productComment.findByIdAndUpdate(
      { _id: id },
      req.body
    )
    res.status(200).json({
      message: "Product Comment Updated Successfully",
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

module.exports.deleteProductComment = async (req, res) => {
  try {
    const id = req.body._id
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
  const { sector } = req.params
  try {
    const products = await Product.find({
      $and: [{ sector }, { apply: "earnCrop" }],
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

module.exports.getRedeemCropProductsBySector = async (req, res) => {
  const { sector } = req.params
  try {
    const products = await Product.find({
      $and: [{ sector }, { apply: "redeemCrop" }],
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

module.exports.getBiddedProductsByBusiness = async (req, res) => {
  console.log("api triggering")
  const user = req.user.user.id
  const bid = true
  console.log(user)
  try {
    const biddedProducts = await Product.find({ user, bid }, { status: 0 })
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

