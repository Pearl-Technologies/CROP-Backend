const { default: mongoose } = require("mongoose")
const invoiceAndPaymentNotification = require("../../models/businessModel/businessNotification/invoiceAndPaymentNotification")
const ObjectId = mongoose.Types.ObjectId

const getProductsSaleCountByMonth = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const startDate = new Date(currentYear, currentMonth, 1)
    const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999)
    const query = {
      businessId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }
    const data = await invoiceAndPaymentNotification.find(query)
    const productMonthSaleCount = data.length
    return res.status(200).send({ productMonthSaleCount })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal server error")
  }
}

const getProductsSaleCountByYear = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const currentYear = new Date().getFullYear()

    console.log("year", new Date(currentYear, 0, 1))

    const data = await invoiceAndPaymentNotification.aggregate([
      {
        $match: {
          businessId: ObjectId(businessId),
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            // $lt: new Date(currentYear + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $year: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ])
    const productYearSaleCount = data
    return res.status(200).send({ productYearSaleCount })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const getProductsSaleCountByMonthlyWise = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const currentYear = new Date().getFullYear()
    const earnData = []
    const redeemData = []
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1)
      const endDate = new Date(currentYear, month + 1, 0, 23, 59, 59, 999)
      const query = {
        type: "Earn Crop",
        businessId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }
      const data = await invoiceAndPaymentNotification.find(query)
      earnData.push(data.length)
    }
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1)
      const endDate = new Date(currentYear, month + 1, 0, 23, 59, 59, 999)
      const query = {
        type: "Redeem Crop",
        businessId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }
      const data = await invoiceAndPaymentNotification.find(query)
      redeemData.push(data.length)
    }
    return res.status(200).send([
      { name: "Earn Products", data: earnData },
      { name: "Redeem Products", data: redeemData },
    ])
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal server error")
  }
}

const getEarnAndRedeemProductsPoints = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const currentYear = new Date().getFullYear()
    const earnData = []
    const redeemData = []
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1)
      const endDate = new Date(currentYear, month + 1, 0, 23, 59, 59, 999)
      const query = {
        type: "Earn Crop",
        businessId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }
      const data = await invoiceAndPaymentNotification.find(query)
      console.log(data, "earned data")
      // earnData.push(data)
    }
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1)
      const endDate = new Date(currentYear, month + 1, 0, 23, 59, 59, 999)
      const query = {
        type: "Redeem Crop",
        businessId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }
      const data = await invoiceAndPaymentNotification.find(query)
      console.log(data, "redeemed data")
      // redeemData.push(data.length)
    }
    return res.status(200).send([
      { name: "Earn Products", data: earnData },
      { name: "Redeem Products", data: redeemData },
    ])
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal server error")
  }
}

const getMostSoldProducts = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const products = await invoiceAndPaymentNotification.aggregate([
      {
        $match: {
          businessId: ObjectId(businessId),
        },
      },
      {
        $lookup: {
          from: "customer_payment_trackers",
          localField: "purchaseOrder.orderId",
          foreignField: "_id",
          as: "purchasedEarnProducts",
        },
      },
      {
        $unwind: "$purchasedEarnProducts",
      },
      {
        $unwind: "$purchasedEarnProducts.cartDetails.cartItems",
      },
      {
        $group: {
          _id: "$purchasedEarnProducts.cartDetails.cartItems._id",
          // productTitle: "$purchasedEarnProducts.cartDetails.cartItems.title",
          totalQuantity: {
            $sum: "$purchasedEarnProducts.cartDetails.cartItems.cartQuantity",
          },
          title: {
            $first: "$purchasedEarnProducts.cartDetails.cartItems.title",
          },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $project: {
          _id: 0,
          cartItemId: "$_id",
          title: 1,
          totalQuantity: 1,
        },
      },
      {
        $limit: 5,
      },
    ])
    return res.status(200).send({ products })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

const getRedeemMostSoldProducts = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const products = await invoiceAndPaymentNotification.aggregate([
      {
        $match: {
          businessId: ObjectId(businessId),
        },
      },
      {
        $lookup: {
          from: "customerpropredeemtrackers",
          localField: "redemptionOrder.orderId",
          foreignField: "_id",
          as: "purchasedRedeemProducts",
        },
      },
      {
        $unwind: "$purchasedRedeemProducts",
      },
      {
        $unwind: "$purchasedRedeemProducts.cartDetails.cartItems",
      },
      {
        $group: {
          _id: "$purchasedRedeemProducts.cartDetails.cartItems._id",
          // productTitle: "$purchasedEarnProducts.cartDetails.cartItems.title",
          totalQuantity: {
            $sum: "$purchasedRedeemProducts.cartDetails.cartItems.cartQuantity",
          },
          title: {
            $first: "$purchasedRedeemProducts.cartDetails.cartItems.title",
          },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $project: {
          _id: 0,
          cartItemId: "$_id",
          title: 1,
          totalQuantity: 1,
        },
      },
      {
        $limit: 5,
      },
    ])
    return res.status(200).send({ products })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}

module.exports = {
  getProductsSaleCountByMonth,
  getProductsSaleCountByYear,
  getProductsSaleCountByMonthlyWise,
  getEarnAndRedeemProductsPoints,
  getMostSoldProducts,
  getRedeemMostSoldProducts,
}