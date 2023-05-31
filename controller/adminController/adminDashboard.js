const admin = require("../../models/superAdminModel/user");
const { customerPaymentTracker } = require("../../models/admin/PaymentTracker/paymentIdTracker");
const  business  = require("../../models/businessModel/business");
const bcrypt = require("bcryptjs");

const dashboard = async (req, res) => {
  try {
    // const businessUsers = await business.aggregate([{$match: {$eq:{status:"active"}}},{$project: {_id: 1}}]);
    // const paymentTrackerForCustomerPurchase = await customerPaymentTracker.aggregate([{$match: {$eq:{status:"active"}}},{$project: {cartDetails: {cartItems: 1}}}]);
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)

    // const paymentTrackerForCustomerPurchase = await customerPaymentTracker.aggregate([
    //   { $match: { $and: [{ status: "paid" }, { $expr: { $eq: [{ $month: "$createdAt" }, { $month: new Date() }] } }] } },
    //   { $unwind: "$cartDetails.cartItems" },
    //   { $project: { "cartDetails.cartItems": 1 } },
    //   { $group: { _id: "$cartDetails.cartItems._id", quantity: { $sum: "$cartDetails.cartItems.cartQuantity" }, businessUser: { $first: "$cartDetails.cartItems.user" } } },
    //   { $group: { _id: "$businessUser", quantity: { $sum: "$quantity" }, user:{ $push:"$_id" } } },
    //   { $sort: { quantity:-1 } },
    //   { $limit : 1 }
    // ])

    const paymentTrackerForCustomerPurchase = await customerPaymentTracker.aggregate([
      {
        $match: {
          status: "paid",
          $expr: {
            $eq: [{ $month: "$createdAt" }, currentMonth]
          }
        }
      },
      { $unwind: "$cartDetails.cartItems" },
      { $project: { "cartDetails.cartItems": 1 } },
      { $group: { _id: "$cartDetails.cartItems._id", quantity: { $sum: "$cartDetails.cartItems.cartQuantity" }, businessUser: { $first: "$cartDetails.cartItems.user" } } },
      { $group: { _id: "$businessUser", quantity: { $sum: "$quantity" }, user: { $push: "$_id" } } },
      { $sort: { quantity: -1 } },
      { $limit: 1 }
    ])

    let empData 

    if(paymentTrackerForCustomerPurchase.length>0){

      empData =  await business.find({_id:paymentTrackerForCustomerPurchase[0]._id});
      console.log(empData)
      res.status(200).json({ data: empData,status:200 });
    }
    else{
      res.status(500).send({msg:"No business user found", status: 500});
    }
  

    // console.log(paymentTrackerForCustomerPurchase)
  } catch (error) {
    console.error(error.message);
    res.status(500).send({msg:"Internal Server Error", status: 500});
  }
};

module.exports = {dashboard};
