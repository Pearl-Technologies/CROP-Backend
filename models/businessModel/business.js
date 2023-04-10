const mongoose = require("mongoose")
const businessSchema = mongoose.Schema(
  {
    title: { type: String },
    businessName: { type: String },
    ABN: { type: String, default: "" },
    ACN: { type: String, default: "" },
    fName: { type: String },
    mName: {
      type: String,
      default: "",
    },
    lName: {
      type: String,
      default: "",
    },
    // Sridhar Start
    natureOfBusiness: { type: String },
    brandLogo: { type: String },
    nameOfLoyaltyProgram: { type: String },
    activeloyaltyProgram: { type: String },
    program: { type: String },
    // activeOffers: { type: String },
    // offerRatings: { type: String },
    auditTrail: [
      {
        updatedDate: { type: Date },
        msg: { type: String },
      },
    ],
    // Sridhar End
    mobile: { type: Number },
    email: { type: String, unique: true },
    status: { type: String, default: "active" },
    outletCount: { type: Number, default: 1 },
    address: { type: Array, default: null },

    notification: { type: Boolean, default: false },
    mktNotification: { type: Boolean, default: false },
    smsNotification: { type: Boolean, default: false },
    emailNotification: { type: Boolean, default: false },
    newsLetterSubscription: { type: Boolean, default: false },

    pin: { type: String, required: true },
    avatar: { type: String, default: "" },
    cropId: { type: String, unique: true },
    Tier: { type: String, default: "base" },
    promoCode: { type: String, default: "" },
    refferalCode: { type: String, unique: true },
    TierChangeDate: { type: Date, default: Date.now },
    terms: { type: Boolean },
    bio: { type: Boolean, default: false },
    transctionInterface: { type: String, default: "online" },
  },
  {
    timestamps: true,
  }
)

const business = mongoose.model("business", businessSchema)

module.exports = business
