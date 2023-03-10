require('dotenv').config();
const connectDB = require('./config/db');

const User = require('./models/User');
const userData = require('./utils/user');
const Coupon = require('./models/Coupon');
const couponData = require('./utils/coupon');
const productData = require('./utils/products');
const Product = require('./models/Product');
const Category = require('./models/Category');
const categoryData = require('./utils/categories');

//Inserting the data in the for string data to analysis the given condition

connectDB();
const importData = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(userData);

    await Product.deleteMany();
    await Product.insertMany(productData);

    await Category.deleteMany();
    await Category.insertMany(categoryData);

    await Coupon.deleteMany();
    await Coupon.insertMany(couponData);

    console.log('data inserted successfully!');
    process.exit();
  } catch (error) {
    console.log('error', error);
    process.exit(1);
  }
};

importData();
