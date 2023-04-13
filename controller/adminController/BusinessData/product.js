const { Product } = require("../../../models/businessModel/product");

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
    let TopMarketProduct = await Product.aggregate([{$match:{'mktOfferFor': 'topRankOffer'}}, {'$sort': {'bidPrice': -1}}, {email:1}]);
    // {'$sort': {'bidPrice': -1}}, {'$match': {'mktOfferFor': 'topRankOffer'}}
  // , {email:1}
    console.log(TopMarketProduct);
  } catch (error) {
    
  }
}
getAllProductAndSendNotification();
module.exports = {getAllProduct};