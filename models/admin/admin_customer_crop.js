const mongoose = require("mongoose");
const adminCustomerCrop = mongoose.model("admin_customer_crop", {
  date: { type: Date, default: Date.now },
  credit: { type: Number },
  debit: { type: Number },
  description: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users_customers",
  },
});

module.exports = adminCustomerCrop;
