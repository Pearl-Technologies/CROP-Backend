const customer = require("../../models/customerModel/customer");
const business = require("../../models/businessModel/business");
const updateTier = async (req, res) => {
  try {
    const { _id, type, tier } = req.body;
    const findCustomerRecord = await customer.findOne({ _id });
    const findBusinessRecord = await business.findOne({ _id });
    // console.log(findCustomerRecord);
    // console.log(findBusinessRecord);
    // return res.send("ok");
    if (findCustomerRecord || findBusinessRecord) {
      if (type === "customer") {
        await customer.findByIdAndUpdate({ _id }, { $set: { tier } }, { new: true });
        res.json("customer records updated");
      } else if (type === "business") {
        await business.findByIdAndUpdate({ _id }, { $set: { Tier:tier } }, { new: true });
        res.json("business records updated");
      }else{
        res.json("account type not found");
      }
    } else {
      res.json("records not found");
    }
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
};
// module.exports = updateTier;
