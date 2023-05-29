const adminBusinessGeneralNotification = require("../../../models/admin/notification/businessGeneralNotification")
const generalNotification = require("../../../models/businessModel/businessNotification/generalNotification")

const createConfirmationOfBookedPromos = async promoProduct => {
  const { user, _id, title } = promoProduct
  try {
    const adminProductCreateNotification =
      await adminBusinessGeneralNotification.findOne({})
    let desc = adminProductCreateNotification.confirmation_of_booked_promos
    const bookededPromosConformation = new generalNotification({
      type: "Booked Promos",
      desc,
      businessId: user,
      bookedPromo: {
        productId: _id,
        productTitle: title,
      },
    })
    const bookedPromos = await bookededPromosConformation.save()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
}
module.exports = { createConfirmationOfBookedPromos }
