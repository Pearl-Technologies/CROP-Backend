const schedule = require("node-schedule");
const { Product } = require("../../../models/businessModel/product");
const { sendEmail } = require("../../../config/email");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { SavePaymentInfo, findPaymentInfo, updatePaymentInfo } = require("../PaymentController/payment");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const NodeGeocoder = require("node-geocoder");
const moment = require("moment");
const {TopRankingPaymentNotification, TopRankingCancelledNotification, TopRankingPaymentNotificationReminder, AllOtherTopRankingPaymentNotification} = require('./topRankingPaymentAndNotification')
const getAllProduct = async (req, res) => {
  const { businessId } = req.body;
  try {
    if (businessId) {
      const productList = await Product.aggregate([
        {
          $match: {
            user: ObjectId(businessId),
          },
        },
        {
          $lookup: {
            from: "products_comments",
            localField: "_id",
            foreignField: "product_id",
            as: "pd",
          },
        },
        {
          $project: {
            title: 1,
            image: 1,
            pd: 1,
            updatedAt: 1,
          },
        },
        {
          $sort: {
            updatedAt: -1,
          },
        },
      ]);
      
      return res.status(200).json({ productList });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};
const getAllMostPopularProduct = async (req, res) => {
  let applyType = req.query.apply;
  let mktFor = req.query.mktFor;
  let apply = "";
  if (applyType == "Earn CROPs") {
    apply = "earnCrop";
  } else {
    apply = "redeemCrop";
  }

  try {
    if ((mktFor = "None")) {
      let productList = await Product.aggregate([
        {
          $match: {
            $or: [
              { apply: apply },
              {apply:"both"}
            ],
          },
        },
        {
          $sort: {
            bidPrice: -1,
          },
        },
      ]);

      return res.status(200).json({ productList });
    } else {
      const productList = await Product.aggregate([
        {
          $match: {
            mktOfferFor: mktFor,
          },
        },
        {
          $match: {
            $or: [{ apply: apply }, { apply: "both" }],
          },
        },
        {
          $sort: {
            bidPrice: -1,
          },
        },
      ]);

      return res.status(200).json({ productList });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const getAllProductByZipCode = async (req, res) => {
  let {zipCode, apply} = req.body
  zipCode = parseInt(zipCode);
  let appliedProduct=''
  if(apply==='Earn CROPs'){
    appliedProduct="earnCrop"
  }else{
    appliedProduct="redeemCrop"
  }
  try {
    const productList = await Product.aggregate([
      {
        $match: {
          zipcode: zipCode,
        },
      },
      {
        $match: {
          $or:[{apply:appliedProduct}, {apply:"both"}]
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);
    res.status(200).json({ productList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};
const getAllProductAndSendNotification = async (dayCount) => {
  if(dayCount == 7){
    //first set of selection and send payment notification 24h
    TopRankingPaymentNotification(dayCount)
  }else if(dayCount == 6){
    TopRankingPaymentNotificationReminder(dayCount)
    //reminder for first set of selection if not paid 12h
  }else if(dayCount == 5){
    TopRankingCancelledNotification(dayCount)
    //cancel first set of selection which not paid and send notification
    //second set of selection and send payment notification 24h
    TopRankingPaymentNotification(dayCount)
  }else if(dayCount == 4){
    TopRankingPaymentNotificationReminder(dayCount)
    //reminder for second set of selection if not paid 12h
  }else if(dayCount == 3){
    TopRankingCancelledNotification(dayCount)
    //cancel second set of selection which not paid and send notification
    //third set of selection and send payment notification 24h
    TopRankingPaymentNotification(dayCount)
  }else if(dayCount == 2){
    TopRankingPaymentNotificationReminder(dayCount)
    //third set of selection and send payment notification 24h
  }else if(dayCount == 1){
    TopRankingCancelledNotification(dayCount)
    //cancel third set of selection which not paid and send notification
    TopRankingPaymentNotification(dayCount)
    //schudule for publish
    AllOtherTopRankingPaymentNotification(dayCount)
  }else if(dayCount = 0){
    //no selection
    TopRankingPaymentNotification(dayCount)
  }
};

const job = schedule.scheduleJob("0 0 * * *", function () {
  console.log("This job runs at midnight every day!");
  for (let dayCount = 7; dayCount >= 0; dayCount--) {
    getAllProductAndSendNotification(dayCount);
  }
});

const getNearMeProducts = async (req, res) => {
  const geocoder = NodeGeocoder({
    provider: "openstreetmap",
  });
  const lat = parseFloat(req.params.lat);
  const long = parseFloat(req.params.long);
  console.log({ lat }, { long });
  let city = "";
  await geocoder
    .reverse({ lat, lon: long })
    .then((res) => {
      city = res[0].city;
      console.log(city);
    })
    .catch((err) => {
      console.error(err);
    });
};
// start the job
job.schedule();
module.exports = {
  getAllProduct,
  getAllMostPopularProduct,
  getAllProductByZipCode,
  getNearMeProducts,
};
