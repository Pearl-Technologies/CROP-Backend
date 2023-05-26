const mongoose = require("mongoose");

const businessOtherServices = mongoose.model("Business_OtherServices", {
  blueDay: { type: Boolean, default: false },
  blueDays: {
    all: { type: Boolean, default: false },
    sun: { type: Boolean, default: false },
    mon: { type: Boolean, default: false },
    tue: { type: Boolean, default: false },
    wed: { type: Boolean, default: false },
    thu: { type: Boolean, default: false },
    fri: { type: Boolean, default: false },
    sat: { type: Boolean, default: false },
  },
  blueDates: {
    fromDate: { type: String },
    toDate: { type: String },
  },
  listOfHolidays: [{ date: { type: Date }, description: { type: String } }],
  defaultSettings: { type: Boolean },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "business",
  },
})


module.exports = businessOtherServices