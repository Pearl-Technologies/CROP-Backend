const mongoose = require("mongoose");
const adminCustomerRequest = mongoose.model("Admin_customer_request", {
  requestNumber: { type: String, required: true },
  requestType: { type: String, required: true },
  description: { type: String, required: true },
  expectedOutcoms: { type: String, required: true },
  preferredMediumContact: { type: String, required: true },
  requestStatus: { type: String, default: "open" },
  requestUpdateDate: { type: Date, default: Date.now },
  requestResponse: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users_customers",
  },
  handler:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin_admin",
  }
});
module.exports = adminCustomerRequest
