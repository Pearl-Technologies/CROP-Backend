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

module.exports = {
  getProductsSaleCountByMonth,
  getProductsSaleCountByYear,
  getProductsSaleCountByMonthlyWise,
  getEarnAndRedeemProductsPoints,
}