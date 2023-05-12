const adminBusinessRequestAndComplainNotification = require("../../../models/admin/notification/businessRequestAndComplainNotification")
const complaintNotification = require("../../../models/businessModel/businessNotification/complaintNotification")

const createMissingCropNotification = async (missingCropsId, businessId) => {
  try {
    const getAdminBusinessNotification =
      await adminBusinessRequestAndComplainNotification.findOne({})
    let desc = getAdminBusinessNotification.missing_points_claim
    const missingCropNotification = new complaintNotification({
      type: "missingCrops",
      desc,
      missingCropsId,
      businessId,
    })
    await missingCropNotification.save()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
}

const getMissingCropsNofications = async (req, res) => {}

module.exports = { createMissingCropNotification, getMissingCropsNofications }
