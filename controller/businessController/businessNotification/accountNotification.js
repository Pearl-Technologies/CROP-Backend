const adminBusinessAccountNotification = require("../../../models/admin/businessAccountNotification")
const accountNotification = require("../../../models/businessModel/businessNotification/accountNotification")

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
