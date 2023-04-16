const { Product } = require("../../../models/businessModel/product");
const { sendEmail } = require("../../../config/email");
const stripe = require("stripe")(
  "sk_test_51Mx307GGhIV5PAANJ3ODV14y6k2SKjFrd9FuG3wybL1UsooXDDVZe6QxHnHqH0Oy7EfS6dRvqcuU8xqHGevRG9bQ00yNUMET47"
);
const endpointSecret =
  "whsec_38ef90abb326130228748b339460defddfe12628c498cdfd39cc55ec12815603";
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
    let TopMarketProduct = await Product.aggregate([{$match:{$and:[{'mktOfferFor': 'topRankOffer'}, {'status': 'active'}]}}, {"$lookup": {
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
      business: {email: 1},
      image:1
    }}, {$limit:10}]);
    // return console.log("toprank offer", TopMarketProduct);
    TopMarketProduct.map(async(user)=>{
          const product  = await stripe.products.create({
            name:"Top Ranking Product",
            // images:[user.image]
          })
          const price = await stripe.prices.create({
            unit_amount:user.bidPrice,
            currency:"aud",
            product:product.id,
            tax_behavior:'inclusive'
          })
      
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
                description: user.title,
                metadata: {order: 'pradeep7829744718'},
                custom_fields: [{name: 'TopRanking', value: 'pradeep7829744719'}],
                rendering_options: {amount_tax_display: 'include_inclusive_tax'},
                footer: 'B2B Inc.',
              },
            },
            after_completion: {type: 'redirect', redirect: {url: 'https://example.com'}},
          });
          let link = paymentLink.url        

      console.log(paymentLink);
      return
      let mailData = {
        from: process.env.EMAIL_USER,
        to: `${user.business.email}`,
        subject: "Payment for topRank",
        html: `<h2>Hello ${user.business.email}</h2>
            <p>Congratulation! You win the bid, Please Pay ${user.bidPrice} for making your product in topRank</p>                    
                    
              <a href="${link}" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none; cursor:"pointer"><button>Pay Now</button></a>
        
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

getAllProductAndSendNotification();
module.exports = {getAllProduct};