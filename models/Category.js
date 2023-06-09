const mongoose = require("mongoose");
const valid = require("validator");

const categorySchema = mongoose.Schema({
  parent: {
    type: String,
    required: true,
    trim: true,
  },
  img: {
    type: String,
    required: true,
    validate: [valid.isURL, "wrong url"]
  },
  children: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: ["Show", "Hide"],
    default: "Show",
  },
},{
  timestamps: true
});

const Category = mongoose.model('categories_customer',categorySchema);
module.exports = Category;
