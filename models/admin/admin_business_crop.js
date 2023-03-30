const mongoose = require("mongoose");
const adminBusinessCrop = mongoose.model("admin_business_crop", {
  date: { type: Date, default: Date.now },
  credit: { type: Number },
  debit: { type: Number },
  description: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "businesses",
  },
});

module.exports = adminBusinessCrop;