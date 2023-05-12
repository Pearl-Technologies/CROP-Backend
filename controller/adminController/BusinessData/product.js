const schedule = require("node-schedule");
const { Product } = require("../../../models/businessModel/product");
const { sendEmail } = require("../../../config/email");
const {
  SavePaymentInfo,
  findPaymentInfo,
  updatePaymentInfo,
} = require("../PaymentController/payment");
const stripe = require("stripe")(
  "sk_test_51Mx307GGhIV5PAANJ3ODV14y6k2SKjFrd9FuG3wybL1UsooXDDVZe6QxHnHqH0Oy7EfS6dRvqcuU8xqHGevRG9bQ00yNUMET47"
);

// Your AccountSID and Auth Token from console.twilio.com
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

const getAllProduct = async (req, res) => {
  const {businessId} = req.body;
  try {
    if(businessId){
      const productList = await Product.find({user:businessId}).sort({updatedAt:-1});
      return res.status(200).json({ productList });
    }
    const productList = await Product.find({}).sort({updatedAt:-1});
    return res.status(200).json({ productList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};
const getAllMostPopularProduct = async (req, res) => {
  try {
    const productList = await Product.aggregate(
      [
        {
          '$match': {
            'mktOfferFor': 'topRank'
          }
        }, {
          '$sort': {
            'updatedAt': -1
          }
        }, {
          '$sort': {
            'bidPrice': -1
          }
        }
      ]
    )
    res.status(200).json({ productList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};
const getAllPromoProduct = async (req, res) => {
  try {
    const productList = await Product.aggregate(
      [
        {
          '$match': {
            'mktOfferFor': 'promo'
          }
        }, {
          '$sort': {
            'updatedAt': -1
          }
        }, {
          '$sort': {
            'bidPrice': -1
          }
        }
      ]
    )
    res.status(200).json({ productList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};
const getAllProductAndSendNotification = async (count) => {
  try {
    let commingWeekDay = () => {
      let today = Date.now() + 1000 * 60 * 60 * 24 * 8;
      if (new Date(today).getDay() !== 6) {
        return today;
      }
      return Date.now();
    };
    let dailyMarketStartDate = new Date(commingWeekDay()).toLocaleDateString();
    //weekdayTopRankProduct
    let TopRankProductForWeekday = await Product.aggregate([
      {
        $match: {
          $and: [
            { mktOfferFor: "topRankOffer" },
            { status: "active" },
            { slot: "weekday" },
            { "mktDate.fromDate": dailyMarketStartDate },
          ],
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
    //weekdayTopRankProduct
    let PromoProductForWeekday = await Product.aggregate([
      {
        $match: {
          $and: [
            { mktOfferFor: "Promo" },
            { status: "active" },
            { slot: "weekday" },
            { "mktDate.fromDate": dailyMarketStartDate },
          ],
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

    let commingMonthlyDay = () => {
      let today = Date.now() + 1000 * 60 * 60 * 24 * 8;
      if (new Date(today).getDate() === 1) {
        return today;
      }
      return Date.now();
    };
    let monthlyMarketStartDate = new Date(
      commingMonthlyDay()
    ).toLocaleDateString();
    // monthlyTopRankProduct
    let TopRankProductForMontly = await Product.aggregate([
      {
        $match: {
          $and: [
            { mktOfferFor: "topRankOffer" },
            { status: "active" },
            { slot: "monthly" },
            { "mktDate.fromDate": monthlyMarketStartDate },
          ],
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
    //monthlyPromoProduct
    let PromoProductForMontly = await Product.aggregate([
      {
        $match: {
          $and: [
            { mktOfferFor: "Promo" },
            { status: "active" },
            { slot: "monthly" },
            { "mktDate.fromDate": monthlyMarketStartDate },
          ],
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
    let commingWeeklyDay = () => {
      let today = Date.now() + 1000 * 60 * 60 * 24 * 8;
      if (new Date(today).getDay() === 0) {
        return today;
      }
      return Date.now();
    };
    let weeklyMarketStartDate = new Date(
      commingWeeklyDay()
    ).toLocaleDateString();
    //weeklyTopRankProduct
    let TopRankProductForWeekly = await Product.aggregate([
      {
        $match: {
          $and: [
            { mktOfferFor: "topRankOffer" },
            { status: "active" },
            { slot: "weekly" },
            { "mktDate.fromDate": weeklyMarketStartDate },
          ],
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
    //weeklyPromoProduct
    let PromoProductForWeekly = await Product.aggregate([
      {
        $match: {
          $and: [
            { mktOfferFor: "Promo" },
            { status: "active" },
            { slot: "weekly" },
            { "mktDate.fromDate": weeklyMarketStartDate },
          ],
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
    let commingWeekEnd = () => {
      let today = Date.now() + 1000 * 60 * 60 * 24 * 8;
      if (new Date(today).getDay() === 6) {
        return today;
      }
      return Date.now();
    };
    let newDate = new Date(commingWeekEnd()).toLocaleDateString();
    
    //weekendTopRankProduct
    let TopRankProductForWeekend = await Product.aggregate([
      {
        $match: {
          $and: [
            { mktOfferFor: "topRankOffer" },
            { status: "active" },
            { slot: "weekday" },
            { "mktDate.fromDate": newDate },
          ],
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
    //weekendPromoProduct
    let PromoProductForWeekend = await Product.aggregate([
      {
        $match: {
          $and: [
            { mktOfferFor: "Promo" },
            { status: "active" },
            { slot: "weekday" },
            { "mktDate.fromDate": newDate },
          ],
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
    let TopRankProductForPublicHoliday = await Product.aggregate([
      {
        $match: {
          $and: [{ mktOfferFor: "topRankOffer" }, { status: "active" }],
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

    let marketProduct = [
      TopRankProductForWeekday,
      TopRankProductForMontly,
      TopRankProductForWeekly,
      TopRankProductForWeekend,
      PromoProductForWeekday,
      PromoProductForMontly,
      PromoProductForWeekly,
      PromoProductForWeekend,
    ];
    const sendNotification = (
      email,
      bidPrice,
      link,
      name,
      slot,
      mktOfferFor
    ) => {
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
            unit_amount: user.bidPrice,
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
              redirect: { url: "http://localhost:3000/success" },
            },
          });
          let link = paymentLink.url;

          SavePaymentInfo(
            paymentLink.id,
            user._id,
            "unpaid",
            link,
            user.business._id,
            count
          );

          // return
          sendNotification(
            user.business.email,
            user.bidPrice,
            link,
            user?.business?.fName,
            user.slot,
            user.mktOfferFor
          );
        } else {
          if (
            count == 1 &&
            findProduct?.tries == 2 &&
            findProduct?.status == "unpaid"
          ) {
            await Product.findByIdAndUpdate(
              { _id: findProduct.productId },
              { $set: { bidPrice: 1, bid: false } }
            );
            //unsuccessfull message for bid loss
          }
          if (count == 2) {
            await updatePaymentInfo(findProduct._id, count);
          }
          // return;
          sendNotification(
            user.business.email,
            user.bidPrice,
            findProduct.paymentUrl,
            user?.business?.fName,
            user.slot,
            user.mktOfferFor
          );
        }
      });
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

var count = 1;
const job = schedule.scheduleJob("* * * * *", function () {
  // console.log('This job runs at midnight every day!');
  return
  console.log('This job runs at midnight every day!');
  if (count == 1) {
    getAllProductAndSendNotification(count)
    count++
  } else if (count == 2) {
    getAllProductAndSendNotification(count)
    count = 1
  }
});

// start the job
job.schedule();
module.exports = { getAllProduct, getAllMostPopularProduct, getAllPromoProduct };
