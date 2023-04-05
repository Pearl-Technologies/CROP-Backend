const mongoose = require("mongoose");
const adminCustomerProp = mongoose.model("admin_customer_prop", {
  date: { type: Date, default: Date.now },
  credit: { type: Number },
  debit: { type: Number },
  description: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users_customers",
    required:true
  },
});

module.exports = adminCustomerProp;
