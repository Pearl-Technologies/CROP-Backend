const mongoose = require("mongoose")

const accountNotificationSchema = mongoose.Schema(
  {
    type: { type: String, required: true },
    desc: { type: String, required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, required: true },
    bookedPromo: {
      productId: { type: mongoose.Schema.Types.ObjectId },
      productTitle: { type: String },
    },
    newProduct: {
      productId: { type: mongoose.Schema.Types.ObjectId },
      productTitle: { type: String },
      productApply: { type: String },
    },
    removedProduct: {
      productTitle: { type: String },
    },
    readed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const generalNotification = mongoose.model(
  "business_general_notification",
  accountNotificationSchema
)

module.exports = generalNotification
