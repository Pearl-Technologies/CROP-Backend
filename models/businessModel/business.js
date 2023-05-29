const mongoose = require("mongoose")
const businessSchema = mongoose.Schema(
  {
    title: { type: String },
    businessName: { type: String, required: true },
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
    natureOfBusiness: { type: String },
    brandLogo: { type: String },
    nameOfLoyaltyProgram: { type: Array },
    activeloyaltyProgram: { type: String },
    program: { type: String },
    auditTrail: [
      {
        updatedDate: { type: Date },
        msg: { type: String },
      },
    ],
    mobile: { type: Number },
    email: { type: String, unique: true },
    status: { type: String, default: "active" },
    outletCount: { type: Number, default: 1 },
    address: [
      {
        line1: String,
        line2: String,
        city: String,
        state: String,
        pincode: Number,
      },
    ],

    notification: { type: Boolean, default: false },
    mktNotification: { type: Boolean, default: false },
    smsNotification: { type: Boolean, default: false },
    emailNotification: { type: Boolean, default: false },
    newsLetterSubscription: { type: Boolean, default: false },

    pin: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true",
    },
    cropId: { type: String, unique: true },
    tier: { type: String, default: "D" },
    promoCode: { type: String, default: "" },
    refferalCode: { type: String },
    tierChangeDate: { type: Date, default: Date.now },
    terms: { type: Boolean },
    bio: { type: Boolean, default: false },
    transctionInterface: { type: String, default: "online" },
    croppoint:{type:Number, default:0}
    
  },
  {
    timestamps: true,
  }
)

const business = mongoose.model("business", businessSchema)

module.exports = business
