const { Product } = require("../../../models/businessModel/product");
const { sendEmail } = require("../../../config/email");

const getAllProduct = async (req, res) => {
  try {
    const productList = await Product.find({});
    res.status(200).json({ productList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg:"Server error"})
  }
};
const getAllProductAndSendNotification=async()=>{
  try {
    let TopMarketProduct = await Product.aggregate([{$match:{'mktOfferFor': 'topRankOffer'}}, {"$lookup": {
      from: "businesses",
      localField: "user",
      foreignField: "_id",
      as: "business"
    }}, 
    {$unwind: "$business"},{"$sort":{bidPrice:-1}},
    {"$project": {
      _id: 1,
      title: 1,
      bidPrice: 1,
      business: {email: 1}
    }}, {$limit:10}]);
    // console.log(TopMarketProduct);
    TopMarketProduct.map(product=>{
      // console.log(product.business.email);
      let mailData = {
        from: process.env.EMAIL_USER,
        to: `${product.business.email}`,
        subject: "Payment for topRank",
        html: `<h2>Hello ${product.business.email}</h2>
            <p>Please Pay ${product.bidPrice} for making your product in topRank</p>
        
              <p>This link will expire in <strong></strong>.</p>
        
              <p style="margin-bottom:20px;">Click this link for active your account</p>
        
              <a href="${
                process.env.STORE_URL
              }/paynow" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none; cursor:"pointer">Verify Account</a>
        
              <p style="margin-bottom:0px;">Thank you</p>
              <strong>CROP Team</strong>
               `,
      };
      let message = "Payment Notification sent to all Topten bidder";
      sendEmail(mailData, message);
    })


  } catch (error) {
    console.log(error);
  }
}



// getAllProductAndSendNotification();
module.exports = {getAllProduct};