const { User } = require("../../models/User");
const business = require("../../models/businessModel/business");
const { createCustomerAudit, createBusinessAudit } = require("./audit");
const updateTier = async (req, res) => {
  try {
    const { _id, type, tier } = req.body;
    const findCustomerRecord = await User.findOne({ _id });
    const findBusinessRecord = await business.findOne({ _id });
    if (findCustomerRecord || findBusinessRecord) {
      if (type === "customer") {
        await User.findByIdAndUpdate(
          { _id },
          { $set: { UserTier: tier, TierChangeDate: Date.now() } },
          { new: true }
        );
        createCustomerAudit(_id, "Tier changed successfully");
        res.status(200).json({ msg: "customer records updated" });
      } else if (type === "business") {
        await business.findByIdAndUpdate(
          { _id },
          { tier: tier, tierChangeDate: Date.now() }
        );
        createBusinessAudit(_id, "Tier changed successfully")
        res.status(200).json({ msg: "business records updated" });
      } else {
        res.json("account type not found");
        res.status(200).json({ msg: "account type not found" });
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
module.exports = updateTier;
