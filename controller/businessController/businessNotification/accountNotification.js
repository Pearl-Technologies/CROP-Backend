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
    const statement = await invoiceAndPaymentNotification.aggregate([
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
          _id: "$type",
          earnTotal: {
            $sum: {
              $cond: [
                { $eq: ["$type", "Earn Crop"] },
                "$item.cropRulesWithBonus",
                0,
              ],
            },
          },
          redeemTotal: {
            $sum: {
              $cond: [
                { $eq: ["$type", "Redeem Crop"] },
                "$item.cropRulesWithBonus",
                0,
              ],
            },
          },
        },
      },
    ])
    return res.status(200).send({ statement })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const createSalesNotification = async (req, res) => {
  const businessId = req.user.user.id
  const currentDate = new Date()
  console.log({ currentDate })
  try {
    const statement = await invoiceAndPaymentNotification.aggregate([
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
          _id: "$type",
          items: { $push: "$item" },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          earnItems: {
            $cond: [{ $eq: ["$_id", "Earn Crop"] }, "$items", []],
          },
          redeemItems: {
            $cond: [{ $eq: ["$_id", "Redeem Crop"] }, "$items", []],
          },
        },
      },
    ])
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
