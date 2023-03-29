const mongoose = require("mongoose");
const adminBusinessRequest = mongoose.model("Admin_business_request", {
  requestNumber: { type: String, required: true },
  requestType: { type: String, required: true },
  description: { type: String, required: true },
  expectedOutcoms: { type: String, required: true },
  preferredMediumContact: { type: String, required: true },
  requestStatus: { type: String, default: "received" },
  requestUpdateDate: { type: Date, default: Date.now },
  requestResponse: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "business_user",
  },
});

module.exports = adminBusinessRequest;
