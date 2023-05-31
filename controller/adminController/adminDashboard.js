const admin = require("../../models/superAdminModel/user");
const { customerPaymentTracker } = require("../../models/admin/PaymentTracker/paymentIdTracker");
const  business  = require("../../models/businessModel/business");
const bcrypt = require("bcryptjs");

const dashboard = async (req, res) => {
  try {
    const businessUsers = await business.aggregate([{$match: {$eq:{status:"active"}}},{$project: {_id: 1}}]);
    const paymentTrackerForCustomerPurchase = await customerPaymentTracker.aggregate([{$match: {$eq:{status:"active"}}},{$project: {cartDetails: {cartItems: 1}}}]);

    
    res.status(202).json({ msg: "records updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({msg:"Internal Server Error", status: 500});
  }
};

module.exports = {dashboard};
