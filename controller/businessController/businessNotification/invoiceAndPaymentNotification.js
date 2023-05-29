const mongoose = require("mongoose")
const invoiceAndPaymentNotification = require("../../../models/businessModel/businessNotification/invoiceAndPaymentNotification")
const ObjectId = mongoose.Types.ObjectId

const getPaymentNotification = async (req, res) => {
  const businessId = req.user.user.id
  const currentDate = new Date()
  const yesterdayDate = new Date(currentDate)
  yesterdayDate.setDate(currentDate.getDate() - 1)
  console.log({ businessId })
  console.log({ currentDate })
  console.log({ yesterdayDate })
  const pipelineStages = [
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
      $project: {
        product: "$item",
        price: "$item.price",
        type: 1,
        desc: 1,
        purchaseOrder: 1,
      },
    },
  ]
  try {
    const yesterDayPaymentNotification =
      await invoiceAndPaymentNotification.aggregate([
        {
          $match: {
            businessId: new ObjectId(businessId),
            $expr: {
              $eq: [
                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                { $dateToString: { format: "%Y-%m-%d", date: yesterdayDate } },
              ],
            },
          },
        },
        {
          $facet: {
            result: pipelineStages,
          },
        },
      ])
    const todayPaymentNotification =
      await invoiceAndPaymentNotification.aggregate([
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
            result: pipelineStages,
          },
        },
      ])
    const olderPaymentNotification =
      await invoiceAndPaymentNotification.aggregate([
        {
          $match: {
            businessId: new ObjectId(businessId),
            $expr: {
              $lt: [
                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                { $dateToString: { format: "%Y-%m-%d", date: yesterdayDate } },
              ],
            },
          },
        },
        {
          $facet: {
            result: pipelineStages,
          },
        },
      ])
    return res.status(201).send({
      yesterDayPaymentNotification: yesterDayPaymentNotification[0].result,
      todayPaymentNotification: todayPaymentNotification[0].result,
      olderPaymentNotification: olderPaymentNotification[0].result,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const getRedeemNotification = async (req, res) => {
  const businessId = req.user.user.id
  const currentDate = new Date()
  const yesterdayDate = new Date(currentDate)
  yesterdayDate.setDate(currentDate.getDate() - 1)
  console.log({ businessId })
  console.log({ currentDate })
  console.log({ yesterdayDate })
  const pipelineStages = [
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
      $project: {
        product: "$item",
        price: "$item.price",
        type: 1,
        desc: 1,
        redeemOrder: 1,
      },
    },
  ]
  try {
    const yesterDayRedeemNotification =
      await invoiceAndPaymentNotification.aggregate([
        {
          $match: {
            businessId: new ObjectId(businessId),
            $expr: {
              $eq: [
                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                { $dateToString: { format: "%Y-%m-%d", date: yesterdayDate } },
              ],
            },
          },
        },
        {
          $facet: {
            result: pipelineStages,
          },
        },
      ])
    const todayRedeemNotification =
      await invoiceAndPaymentNotification.aggregate([
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
            result: pipelineStages,
          },
        },
      ])
    const olderRedeemNotification =
      await invoiceAndPaymentNotification.aggregate([
        {
          $match: {
            businessId: new ObjectId(businessId),
            $expr: {
              $lt: [
                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                { $dateToString: { format: "%Y-%m-%d", date: yesterdayDate } },
              ],
            },
          },
        },
        {
          $facet: {
            result: pipelineStages,
          },
        },
      ])
    return res.status(201).send({
      yesterDayRedeemNotification: yesterDayRedeemNotification[0].result,
      todayRedeemNotification: todayRedeemNotification[0].result,
      olderRedeemNotification: olderRedeemNotification[0].result,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

module.exports = { getPaymentNotification, getRedeemNotification }
