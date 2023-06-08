const mongoose = require("mongoose");

const businessFeedback = mongoose.model("Business_Feedback", {
  rating: { type: Number, required: true },
  feedback: { type: String },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "business",
  },
})

module.exports = { businessFeedback }
