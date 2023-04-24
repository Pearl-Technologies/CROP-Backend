const mongoose = require('mongoose');

const ProductCategory = mongoose.model("admin_product_category",{
    image: {type: String},
    categoryName: {type: String, unique: true}
})

module.exports = ProductCategory