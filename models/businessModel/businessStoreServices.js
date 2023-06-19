const mongoose = require("mongoose")
const businessStoreServices = mongoose.model("Business_Store_Services", {
  pickup: { type: Boolean, default: true },
  delivery: { type: Boolean, default: false },
  deliveryDetails: {
    deliveryAgainstCrops: {
      isTrue: { type: Boolean, default: false },
      cropValueForDelivery: { type: Number },
    },
    deliveryAgainstPayment: {
      isTrue: { type: Boolean, default: false },
      deliveryChargesAUD: { type: Number },
    },
  },
  workingDayAndHours: {
    sunday: {
      working: { type: Boolean, default: false },
      operatingHours: {
        from: { type: String, default: "" },
        to: { type: String, default: "" },
      },
    },
    monday: {
      working: { type: Boolean, default: false },
      operatingHours: {
        from: { type: String, default: "" },
        to: { type: String, default: "" },
      },
    },
    tuesday: {
      working: { type: Boolean, default: false },
      operatingHours: {
        from: { type: String, default: "" },
        to: { type: String, default: "" },
      },
    },
    wednesday: {
      working: { type: Boolean, default: false },
      operatingHours: {
        from: { type: String, default: "" },
        to: { type: String, default: "" },
      },
    },
    thursday: {
      working: { type: Boolean, default: false },
      operatingHours: {
        from: { type: String, default: "" },
        to: { type: String, default: "" },
      },
    },
    friday: {
      working: { type: Boolean, default: false },
      operatingHours: {
        from: { type: String, default: "" },
        to: { type: String, default: "" },
      },
    },
    saturday: {
      working: { type: Boolean, default: false },
      operatingHours: {
        from: { type: String, default: "" },
        to: String,
      },
    },
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "business",
    unique: true,
  },
  listOfHolidays: [],
})

module.exports = businessStoreServices
