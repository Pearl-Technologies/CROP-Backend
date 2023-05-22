const mongoose = require('mongoose');
const valid = require("validator");
// const Category = require("/Category.js");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sector: { type: String, required: true },
    image: {
      type: [],
      default: [],
    },
    originalPrice: {
      type: Number,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    croppoints: {
      type: Number,
      default: 0,
    },
    redeemCROPs: {
      type: Number,
    },
    apply: { type: String, required: true },
    availDate: {
      fromDate: { type: String },
      toDate: { type: String },
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inActive", "published"],
    },
    customiseMsg: { type: String, required: true },

    slot: { type: String },
    mktOfferFor: { type: String, default: "" },
    mktDate: {
      fromDate: { type: String },
      toDate: { type: String },
    },
    bidDate: {
      fromDate: { type: String },
      toDate: { type: String },
    },
    bidPrice: { type: Number, default: 0 },
    bid: { type: Boolean, default: false },
    market: { type: Boolean, default: false },
    city: { type: String },
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model("business_products", productSchema)

const productCommentSchema = mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "business_products",
    },
    details: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "users_customer",
        },
        comment: { type: String, default: null },
        rating: { type: Number, default: 0 },
        likes: [
          {
            like: { type: Boolean },
            user_id: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: "users_customer",
            },
            require: false,
            status: { type: Boolean, required: true, default: true },
          },
        ],
        status: { type: Boolean, required: true, default: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    product_likes: [
      {
        like: { type: Boolean },
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "users_customer",
        },
        require: false,
        status: { type: Boolean, required: true, default: true },
      },
    ],
    status: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
)

const productComment = mongoose.model("products_comments", productCommentSchema)


const productCommentReplySchema = mongoose.Schema(
  {
    productcomments_id: { type: mongoose.Schema.Types.ObjectId, ref: "products_comments" },
    reply: [{ type: String, user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users_customer" }, map_id: {type: mongoose.Schema.Types.ObjectId, ref: "products_comments_reply" }, default: "", status:{type:Boolean,required:true, default: true} }],
    likes: [{ type: Boolean, user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users_customer" }, require: false, status:{type:Boolean,required:true, default: true} }],
    status:{type:Boolean,required:true, default: true}
  },
  {
    timestamps: true,
  }
)

const productCommentReply = mongoose.model("products_comments_reply", productCommentReplySchema)

module.exports = { Product, productComment, productCommentReply }


