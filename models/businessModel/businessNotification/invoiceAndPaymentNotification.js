const mongoose = require("mongoose")

const invoiceAndPaymentNotificationSchema = mongoose.Schema(
  {
    type: { type: String, required: true },
    desc: { type: String, required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, required: true },
    payment: {
        transactionId:String,
    },
    purchaseOrder: {
      orderId: { type: mongoose.Schema.Types.ObjectId },
    },
    redemptionOrder: {
      orderId: { type: mongoose.Schema.Types.ObjectId },
    },
    redemption: {
      type: { type: String },
      redeemedCrops: { type: Number },
      redeemedProps: { type: Number },
    },
    readed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const invoiceAndPaymentNotification = mongoose.model(
  "business_invoice_payment_notification",
  invoiceAndPaymentNotificationSchema
)

module.exports = invoiceAndPaymentNotification
