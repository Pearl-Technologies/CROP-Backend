const invoiceAndPaymentNotification = require("../../models/businessModel/businessNotification/invoiceAndPaymentNotification")

const getEarnCropProductsSaleCountByMonth = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const currentYear = new Date().getFullYear()
    const monthlyData = []

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
      monthlyData.push(data.length)

      if (monthlyData.length === 12) {
        console.log("Data for each month:", monthlyData)
      }
    }
    return res.status(200).send({ name: "Earn Products", data: monthlyData })
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal server error")
  }
}

module.exports = { getEarnCropProductsSaleCountByMonth }
