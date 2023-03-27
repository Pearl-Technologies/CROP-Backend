require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const MongoClient = require("mongodb").MongoClient;
const databasename = "test";
const MONGO_URI = process.env.MONGO_URI;

// MongoClient.connect(MONGO_URI).then((client) => {

//   const connect = client.db(databasename);
//   // Connect to collection
//   const collection = connect.collection("orders_customer");
//   // Rename the collection name
//   collection.rename("orders_customers");
//   console.log("Updation successful");
// }).catch((err) => {
//   console.log(err.Message);
// })

const connectDB = async () => {

  try { 
    await mongoose.connect(MONGO_URI);
    console.log('mongodb connection success!');
  } catch (err) {
    console.log('mongodb connection failed!', err.message);
  }

};

module.exports = connectDB;
