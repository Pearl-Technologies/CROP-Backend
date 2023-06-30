const schedule = require("node-schedule");
const { Product } = require("../../../models/businessModel/product");
const { sendEmail } = require("../../../config/email");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { SavePaymentInfo, findPaymentInfo, updatePaymentInfo } = require("../PaymentController/payment");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const NodeGeocoder = require("node-geocoder");
const moment = require("moment");

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
  try {
    let commingWeekDay = () => {
      const currentDate = moment().add(dayCount, "day");
      const nextWeekday = getNextWeekday(currentDate);
      return nextWeekday.format("YYYY-MM-DD");

      function getNextWeekday(date) {
        const dayOfWeek = date.day();
        const daysToAdd = dayOfWeek === 5 ? 3 : dayOfWeek === 6 ? 2 : 1;
        return moment(date).add(daysToAdd, "days");
      }
    };
    let dailyMarketStartDate = commingWeekDay();
    // console.log(dailyMarketStartDate, "startDate weekday");
    //weekdayProduct
    let TopRankProductForWeekday = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "topRank" }, { status: "active" }, { slot: "weekday" }, { bid: true }, { market: false }, { "mktDate.fromDate": dailyMarketStartDate }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
          mktOfferFor: 1,
          slot: 1,
        },
      },
    ]);
    let PromoProductForWeekday = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "promo" }, { status: "active" }, { slot: "weekday" }, { bid: true }, { market: false }, { "mktDate.fromDate": dailyMarketStartDate }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
          mktOfferFor: 1,
          slot: 1,
        },
      },
    ]);
    let ComboProductForWeekday = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "both" }, { status: "active" }, { slot: "weekday" }, { bid: true }, { market: false }, { "mktDate.fromDate": dailyMarketStartDate }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
          mktOfferFor: 1,
          slot: 1,
        },
      },
    ]);
    //weekendProduct
    let commingWeekEndDate = () => {
      const currentDate = moment().add(dayCount, "day");
      const nextWeekend = getNextWeekend(currentDate);
      // if (
      //   moment(nextWeekend).subtract(8, "day").format("YYYY-MM-DD") ===
      //   moment().format("YYYY-MM-DD")
      // ) {
      //   return nextWeekend.format("YYYY-MM-DD");
      // }
      return nextWeekend.format("YYYY-MM-DD");

      function getNextWeekend(date) {
        let nextDay = date.clone().startOf("isoWeek").add(5, "days");
        if (date.isoWeekday() >= 6) {
          nextDay = nextDay.add(dayCount, "days");
        }
        return nextDay;
      }
    };
    let dailyMarketStartDateForWeekend = commingWeekEndDate();
    let TopRankProductForWeekend = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "topRank" }, { status: "active" }, { slot: "weekend" }, { bid: true }, { market: false }, { "mktDate.fromDate": dailyMarketStartDateForWeekend }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
          mktOfferFor: 1,
          slot: 1,
        },
      },
    ]);
    let PromoProductForWeekend = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "promo" }, { status: "active" }, { slot: "weekend" }, { bid: true }, { market: false }, { "mktDate.fromDate": dailyMarketStartDateForWeekend }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
          mktOfferFor: 1,
          slot: 1,
        },
      },
    ]);
    let ComboProductForWeekend = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "both" }, { status: "active" }, { slot: "weekend" }, { bid: true }, { market: false }, { "mktDate.fromDate": dailyMarketStartDateForWeekend }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
          mktOfferFor: 1,
          slot: 1,
        },
      },
    ]);
    // weeklyProduct
    let commingWeeklyDate = () => {
      const currentDate = moment().add(dayCount, "day");
      const nextWeekDate = getNextWeekDate(currentDate);
      if (moment(nextWeekDate).add(1, "day").subtract(8, "day").format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) {
        return moment().format("YYYY-MM-DD");
      }
      return moment().format("YYYY-MM-DD");
      function getNextWeekDate(date) {
        return date.clone().add(1, "week").startOf("week");
      }
    };
    let commingWeeklyStartDate = commingWeeklyDate();
    let TopRankProductForWeekly = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "topRank" }, { status: "active" }, { slot: "weekly" }, { bid: true }, { market: false }, { "mktDate.fromDate": commingWeeklyStartDate }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
          mktOfferFor: 1,
          slot: 1,
        },
      },
    ]);
    let PromoProductForWeekly = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "promo" }, { status: "active" }, { slot: "weekly" }, { bid: true }, { market: false }, { "mktDate.fromDate": commingWeeklyStartDate }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
          mktOfferFor: 1,
          slot: 1,
        },
      },
    ]);
    let ComboProductForWeekly = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "both" }, { status: "active" }, { slot: "weekly" }, { bid: true }, { market: false }, { "mktDate.fromDate": commingWeeklyStartDate }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
          mktOfferFor: 1,
          slot: 1,
        },
      },
    ]);
    //monthlyProduct
    let commingMonthlyDate = () => {
      const currentDate = moment();
      const nextMonthDate = getNextMonthDate(currentDate);
      if (nextMonthDate.subtract(dayCount, "day").format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) {
        return moment().format("YYYY-MM-DD");
      }
      return moment().format("YYYY-MM-DD");
      function getNextMonthDate(date) {
        return date.clone().add(1, "month").startOf("month");
      }
    };
    let commingMonthlyStartDate = commingMonthlyDate();
    let TopRankProductForMonthly = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "topRank" }, { status: "active" }, { slot: "monthly" }, { bid: true }, { market: false }, { "mktDate.fromDate": commingMonthlyStartDate }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
        },
      },
    ]);
    let PromoProductForMonthly = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "promo" }, { status: "active" }, { slot: "monthly" }, { bid: true }, { market: false }, { "mktDate.fromDate": commingMonthlyStartDate }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
        },
      },
    ]);
    let ComboProductForMonthly = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "both" }, { status: "active" }, { bid: true }, { market: false }, { slot: "weekly" }, { "mktDate.fromDate": commingMonthlyStartDate }],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "user",
          foreignField: "_id",
          as: "business",
        },
      },
      { $unwind: "$business" },
      { $sort: { bidPrice: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          bidPrice: 1,
          business: { email: 1, fName: 1, _id: 1 },
          image: 1,
          mktOfferFor: 1,
          slot: 1,
        },
      },
    ]);

    let marketProduct = [TopRankProductForWeekday, PromoProductForWeekday, ComboProductForWeekday, TopRankProductForWeekend, PromoProductForWeekend, ComboProductForWeekend, TopRankProductForWeekly, PromoProductForWeekly, ComboProductForWeekly, TopRankProductForMonthly, PromoProductForMonthly, ComboProductForMonthly];
    const sendNotification = (email, bidPrice, link, name, slot, mktOfferFor) => {
      // console.log(email, bidPrice, link, name);
      let mailData = {
        from: process.env.EMAIL_USER,
        to: `${email}`,
        subject: `Payment for ${slot}${" "}${mktOfferFor}`,
        html: `<h2>Hello ${name}</h2>
          <p>Congratulation! You product got slected to TopRank, Please Pay ${bidPrice} for retained the same with in 24 hours</p>                    
                  
            <a href="${link}" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none; cursor:"pointer"><button>Pay Now</button></a>
      
            <p style="margin-bottom:0px;">Thank you</p>
            <strong>CROP Team</strong>
             `,
      };
      let message = "Payment Notification sent to all Topten bidder";
      sendEmail(mailData, message);

      // client.messages
      //   .create({
      //     body: `<h2>Hello ${name}</h2>
      // <p>Congratulation! You product got slected to TopRank, Please Pay ${bidPrice} for retained the same with in 24 hours</p>

      //   <a href="${link}" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none; cursor:"pointer"><button>Pay Now</button></a>

      //   <p style="margin-bottom:0px;">Thank you</p>
      //   <strong>CROP Team</strong>`,
      //     from: "whatsapp:+14155238886",
      //     to: "whatsapp:+917829744718",
      //   })
      //   .then((message) => console.log(message.sid));
    };
    marketProduct.map((data) => {
      data.slice(0, 10).map(async (user) => {
        let findProduct = await findPaymentInfo(user._id);
        if (!findProduct) {
          const product = await stripe.products.create({
            name: "Top Ranking Product",
            // id:user._id.toString(),
          });
          const price = await stripe.prices.create({
            unit_amount: user.bidPrice * 100,
            currency: "aud",
            product: product.id,
            tax_behavior: "inclusive",
          });

          const paymentLink = await stripe.paymentLinks.create({
            line_items: [
              {
                price: price.id,
                quantity: 1,
              },
            ],
            invoice_creation: {
              enabled: true,
              invoice_data: {
                description: user._id.toString(),
                rendering_options: {
                  amount_tax_display: "include_inclusive_tax",
                },
                footer: "CROP",
              },
            },
            after_completion: {
              type: "redirect",
              redirect: {
                url: `https://business.${process.env.HOST}/business/market/payment/success`,
              },
            },
          });
          let link = paymentLink.url;

          SavePaymentInfo(paymentLink.id, user._id, "unpaid", link, user.business._id, 1, user.bidPrice, "Top Ranking Product");

          // return
          sendNotification(user.business.email, user.bidPrice, link, user?.business?.fName, user.slot, user.mktOfferFor);
        } else {
          if (findProduct?.tries == 2 && findProduct?.status == "unpaid") {
            await Product.findByIdAndUpdate({ _id: findProduct.productId }, { $set: { bid: false } });
            //unsuccessfull message for bid loss
          }
          if (findProduct?.tries == 1) {
            await updatePaymentInfo(findProduct._id, 2);
          }
          // return;
          sendNotification(user.business.email, user.bidPrice, findProduct.paymentUrl, user?.business?.fName, user.slot, user.mktOfferFor);
        }
      });
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

const job = schedule.scheduleJob("0 0 * * *", function () {
  console.log("This job runs at midnight every day!");
  for (let dayCount = 7; dayCount > 0; dayCount--) {
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
