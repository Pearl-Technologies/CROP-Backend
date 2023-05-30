const invoiceAndPaymentNotification = require("../../models/businessModel/businessNotification/invoiceAndPaymentNotification")

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

module.exports = { getProductsSaleCountByMonthlyWise }
