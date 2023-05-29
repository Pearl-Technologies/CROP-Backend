const { mongoose } = require("mongoose")
const adminBusinessAccountNotification = require("../../../models/admin/notification/businessAccountNotification")
const invoiceAndPaymentNotification = require("../../../models/businessModel/businessNotification/invoiceAndPaymentNotification")
const accountNotification = require("../../../models/businessModel/businessNotification/accountNotification")
const ObjectId = mongoose.Types.ObjectId

const createBusPinChangeNofication = async (req, res) => {
  try {
    const getAdminBusinessNotification =
      await adminBusinessAccountNotification.findOne({})
    let desc = getAdminBusinessNotification.pin_change
    const pinChangeNotification = new accountNotification({
      type: "pinChange",
      desc,
    })
    await pinChangeNotification.save()
    return res.status(200)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
}

const getBusPinChangeNofication = async (req, res) => {}

const createPointsTransactionNotification = async (req, res) => {
  const businessId = req.user.user.id
  const currentDate = new Date()
  console.log({ currentDate })
  try {
    const getAdminBusinessNotification =
      await adminBusinessAccountNotification.findOne({})
    const desc = getAdminBusinessNotification.points_transaction
    const pointsTransactions = await invoiceAndPaymentNotification.aggregate([
      {
        $match: {
          businessId: new ObjectId(businessId),
          $expr: {
            $eq: [
              { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              { $dateToString: { format: "%Y-%m-%d", date: currentDate } },
            ],
          },
        },
      },
      {
        $facet: {
          earnTransactions: [
            {
              $lookup: {
                from: "customer_payment_trackers",
                localField: "purchaseOrder.orderId",
                foreignField: "_id",
                as: "orders",
              },
            },
            {
              $unwind: "$orders",
            },
            {
              $unwind: "$orders.cartDetails.cartItems",
            },
            {
              $addFields: {
                item: "$orders.cartDetails.cartItems",
              },
            },
            {
              $addFields: {
                user: "$item.user",
              },
            },
            {
              $match: {
                user: businessId,
                type: "Earn Crop",
              },
            },
            {
              $group: {
                _id: null,
                earnTotal: {
                  $sum: "$item.cropRulesWithBonus",
                },
              },
            },
          ],
          redeemTransactions: [
            {
              $lookup: {
                from: "customerredeemtrackers",
                localField: "redemptionOrder.orderId",
                foreignField: "_id",
                as: "orders",
              },
            },
            {
              $unwind: "$orders",
            },
            {
              $unwind: "$orders.cartDetails.cartItems",
            },
            {
              $addFields: {
                item: "$orders.cartDetails.cartItems",
              },
            },
            {
              $addFields: {
                user: "$item.user",
              },
            },
            {
              $match: {
                user: businessId,
                type: "Redeem Crop",
              },
            },
            {
              $group: {
                _id: null,
                redeemTotal: {
                  $sum: "$item.cropRulesWithBonus",
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          earnTotal: { $arrayElemAt: ["$earnTransactions.earnTotal", 0] },
          redeemTotal: { $arrayElemAt: ["$redeemTransactions.redeemTotal", 0] },
        },
      },
    ]);
    console.log(pointsTransactions)
    if (pointsTransactions.length > 0) {
      const pointsTransactionNotification = await new accountNotification({
        type: "pointsTransaction",
        businessId,
        desc,
        pointsTransaction: {
          earnedCrops: pointsTransactions[0].earnTotal,
          redeemedCrops: pointsTransactions[0].redeemTotal,
        },
      })
      const pointNotification = await pointsTransactionNotification.save()
      return res.status(200).send({ pointNotification })
    }
    return res.status(200).send("Today Point Transaction Not Happened")
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const createSalesNotification = async (req, res) => {
  const businessId = req.user.user.id
  const currentDate = new Date()
  try {
    const endOftheProductSold = await invoiceAndPaymentNotification.aggregate([
      {
        $match: {
          businessId: new ObjectId(businessId),
          $expr: {
            $eq: [
              { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              { $dateToString: { format: "%Y-%m-%d", date: currentDate } },
            ],
          },
        },
      },

      {
        $lookup: {
          from: "customer_payment_trackers",
          localField: "purchaseOrder.orderId",
          foreignField: "_id",
          as: "orders",
        },
      },
      {
        $unwind: {
          path: "$orders",
        },
      },
      {
        $unwind: {
          path: "$orders.cartDetails.cartItems",
        },
      },
      {
        $addFields: {
          item: "$orders.cartDetails.cartItems",
        },
      },
      {
        $addFields: {
          user: "$item.user",
        },
      },
      {
        $match: {
          user: businessId,
        },
      },
      {
        $group: {
          _id: null,
          earnItems: {
            $push: {
              $cond: [{ $eq: ["$type", "Earn Crop"] }, "$item", null],
            },
          },
          redeemItems: {
            $push: {
              $cond: [{ $eq: ["$type", "Redeem Crop"] }, "$item", null],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          earnItems: {
            $filter: {
              input: "$earnItems",
              as: "item",
              cond: { $ne: ["$$item", null] },
            },
          },
          redeemItems: {
            $filter: {
              input: "$redeemItems",
              as: "item",
              cond: { $ne: ["$$item", null] },
            },
          },
        },
      },
    ])
    if (endOftheProductSold.length > 0) {
      console.log(
        "count",
        endOftheProductSold[0].earnItems.length +
          endOftheProductSold[0].redeemItems.length
      )
      const salesNotification = new accountNotification({
        type: "sales",
        businessId: 1,
        earnProducts: endOftheProductSold[0].earnItems,
        redeemProducts: endOftheProductSold[0].redeemItems,
        totalProducts:
          endOftheProductSold[0].earnItems.length +
          endOftheProductSold[0].redeemItems.length,
        earnProductTotalAmount: { type: Number },
      })
    }
    return res.status(200).send({ statement })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const createProgramChangesNotification = async (programType, businessId) => {
  const currentDate = new Date().toLocaleDateString()
  const type = "Program Change"
  let content = ""
  try {
    const getAdminBusinessNotification =
      await adminBusinessAccountNotification.findOne({})
    const adminEarnPoints =
      getAdminBusinessNotification.program_change_Offer_points
    const adminRedeemPoints =
      getAdminBusinessNotification.program_change_redemption
    const adminBonusPoints =
      getAdminBusinessNotification.program_change_bonus_points
    const adminSlashRedeemPoints =
      getAdminBusinessNotification.program_change_slash_redeemption_changes
    const adminHappyHours =
      getAdminBusinessNotification.program_change_happy_hours
    if (programType == "earnPoints") {
      content = adminEarnPoints
    } else if (programType == "redeemPoints") {
      content = adminRedeemPoints
    } else if (programType == "bonusPoints") {
      content = adminBonusPoints
    } else if (programType == "slashRedeemPoints") {
      content = adminSlashRedeemPoints
    } else if (programType == "happyHours") {
      content = adminHappyHours
    }
    console.log({ content })
    const desc = content.replace("[date]", currentDate)
    const programChangeNotification = new accountNotification({
      type,
      businessId,
      desc,
    })
    console.log(programChangeNotification, "change")
    await programChangeNotification.save()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createPointsTransactionNotification,
  createSalesNotification,
  createProgramChangesNotification,
}


// const createPointsTransactionNotification = async (req, res) => {
//   const businessId = req.user.user.id
//   const currentDate = new Date()
//   console.log({ currentDate })
//   try {
//     const getAdminBusinessNotification =
//       await adminBusinessAccountNotification.findOne({})
//     const desc = getAdminBusinessNotification.points_transaction
//     const pointsTransactions = await invoiceAndPaymentNotification.aggregate([
//       {
//         $match: {
//           businessId: new ObjectId(businessId),
//           $expr: {
//             $eq: [
//               { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//               { $dateToString: { format: "%Y-%m-%d", date: currentDate } },
//             ],
//           },
//         },
//       },

//       {
//         $lookup: {
//           from: "customer_payment_trackers",
//           localField: "purchaseOrder.orderId",
//           foreignField: "_id",
//           as: "orders",
//         },
//       },
//       {
//         $unwind: {
//           path: "$orders",
//         },
//       },
//       {
//         $unwind: {
//           path: "$orders.cartDetails.cartItems",
//         },
//       },
//       {
//         $addFields: {
//           item: "$orders.cartDetails.cartItems",
//         },
//       },
//       {
//         $addFields: {
//           user: "$item.user",
//         },
//       },
//       {
//         $match: {
//           user: businessId,
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           earnTotal: {
//             $sum: {
//               $cond: [
//                 { $eq: ["$type", "Earn Crop"] },
//                 "$item.cropRulesWithBonus",
//                 0,
//               ],
//             },
//           },
//           redeemTotal: {
//             $sum: {
//               $cond: [
//                 { $eq: ["$type", "Redeem Crop"] },
//                 "$item.cropRulesWithBonus",
//                 0,
//               ],
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           earnTotal: 1,
//           redeemTotal: 1,
//         },
//       },
//     ])
//     console.log(pointsTransactions)
//     if (pointsTransactions.length > 0) {
//       const pointsTransactionNotification = await new accountNotification({
//         type: "pointsTransaction",
//         businessId,
//         desc,
//         pointsTransaction: {
//           earnedCrops: pointsTransactions[0].earnTotal,
//           redeemedCrops: pointsTransactions[0].redeemTotal,
//         },
//       })
//       const pointNotification = await pointsTransactionNotification.save()
//       return res.status(200).send({ pointNotification })
//     }
//     return res.status(200).send("Today Point Transaction Not Happened")
//   } catch (error) {
//     console.log(error)
//     return res.status(500).send("Internal Server Error")
//   }
// }