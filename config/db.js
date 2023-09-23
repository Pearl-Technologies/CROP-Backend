require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
// const MongoClient = require("mongodb").MongoClient;
const databasename = "test";
const MONGO_URI = process.env.MONGO_URI;


const connectDB = async () => {
  try { 
    mongoose.connect(MONGO_URI);
    console.log('mongodb connection success!');
  } catch (err) {
    console.log('mongodb connection failed!', err.message);
  }

};
mongoose.connection.on('connected', ()=>{
  console.log("server is connected to mongodb")
})
mongoose.connection.on('error', ()=>{
  console.log(`connection error: ${error.message}` )
})
mongoose.connection.on('disconnected', async()=>{
  console.log("mongodb successfully disconnected")
})

process.on('SIGINT', async()=>{
  await mongoose.connection.close();
  process.kill(0)
})

module.exports = connectDB;
