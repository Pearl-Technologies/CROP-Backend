const admin = require("../../models/superAdminModel/user");
const { customerPaymentTracker } = require("../../models/admin/PaymentTracker/paymentIdTracker");
const  business  = require("../../models/businessModel/business");
const bcrypt = require("bcryptjs");
const { User } = require("../../models/User")

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
      { $group: { _id: "$businessUser", quantity: { $sum: "$quantity" }, products: { $push: "$_id" } } },
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
      res.status(200).send({data:[],msg:"No business user found", status: 200});
    }
  

    // console.log(paymentTrackerForCustomerPurchase)
  } catch (error) {
    console.error(error.message);
    res.status(500).send({msg:"Internal Server Error", status: 500});
  }
};

const getDetailsCount = async (req, res)=>{
  try{
    const businessData = await business.aggregate([{$group:{_id:"$status",count:{$sum:1}}},
    { $group:{
      _id:"BusinessCount",
      business:{
        $push:{
          status:"$_id",
          count:"$count"
        }
      },
      TotalBusiness:{$sum:"$count"}
    } }
    ])

    const userData = await User.aggregate([{$group:{_id:"$status",count:{$sum:1}}},
    { $group:{
      _id:"CustomerCount",
      customer:{
        $push:{
          status:"$_id",
          count:"$count"
        }
      },
      TotalCustomer:{$sum:"$count"}
    } }
    ])

    res.status(200).json({ data: {...userData[0],...businessData[0]},status:200 });
  }
  catch(err){
    console.log(err)
    res.status(500).send({msg:"Internal server error", status: 500});
  }
}

const getSalesDeatils = async(req, res)=>{
  try{
    // const salesDetails = await customerPaymentTracker.aggregate([
    //   {
    //     $match: {
    //       $and: [
    //         { status: "paid" },
    //         { $expr: { $eq: [{ $month: "$createdAt" }, { $month: new Date() }] } }
    //       ]
    //     }
    //   },
    //   { $unwind: "$cartDetails.cartItems" },
    //   { $project: { "cartDetails.cartItems": 1 } },
    //   {
    //     $group: {
    //       _id: "$cartDetails.cartItems._id",
    //       productName: { $first: "$cartDetails.cartItems.title" },
    //       price: { $sum: "$cartDetails.cartItems.price" },
    //       quantity: { $sum: "$cartDetails.cartItems.cartQuantity" },
    //       businessUser: { $first: "$cartDetails.cartItems.user" }
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: "$businessUser",
    //       totalPrice: { $sum: "$price" },
    //       quantity: { $sum: "$quantity" },
    //       products: { $push: "$_id" },
    //       productNames: { $push: "$productName" }
    //     }
    //   },
    //   { $sort: { quantity: -1 } },
    //   { $limit: 3 }
    // ])
    const salesDetails = await customerPaymentTracker.aggregate([
      {
        $match: {
          $and: [
            { status: "paid" }
          ]
        }
      },
      {$facet:
        {
          salesDetails:[
          {
              $match: {
                $and: [
                  { status: "paid" },
                  { $expr: { $eq: [{ $month: "$createdAt" }, { $month: new Date() }] } }
                ]
              }
          },
          { $unwind: "$cartDetails.cartItems" },
          { $project: { "cartDetails.cartItems": 1 } },
          {
            $group: {
              _id: "$cartDetails.cartItems._id",
              productName: { $first: "$cartDetails.cartItems.title" },
              price: { $sum: "$cartDetails.cartItems.price" },
              quantity: { $sum: "$cartDetails.cartItems.cartQuantity" },
              businessUser: { $first: "$cartDetails.cartItems.user" }
            }
          },
          {
            $group: {
              _id: "$businessUser",
              totalPrice: { $sum: "$price" },
              quantity: { $sum: "$quantity" },
              products: { $push: "$_id" },
              productNames: { $push: "$productName" }
            }
          },
          { $sort: { quantity: -1 } },
          { $limit: 3 }],
          salesPercentage:[
            {
              $match: {
                $and: [
                  { status: "paid" },
                  {
                    $or: [
                      { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), $lt: new Date() } }, // Previous month
                      { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) } } // Current month
                    ]
                  }
                ]
              }
            },
            { $unwind: "$cartDetails.cartItems" },
            { $addFields: { createdAt: "$createdAt" } },
            {
              $group: {
                _id: {
                  $cond: {
                    if: { $eq: [{ $dateToString: { format: "%Y-%m", date: "$createdAt" } }, { $dateToString: { format: "%Y-%m", date: new Date() } }] },
                    then: "Current Month",
                    else: "Previous Month"
                  }
                },
                totalPrice: { $sum: "$cartDetails.cartItems.price" }
              }
            }
          ]
        }
      }
    ])
    
    

    let empData=[];


    let finalData = await Promise.all(salesDetails[0].salesDetails.map(async (data) => {
      let tempData = await business.find({ _id: data._id });
      // let userName = tempData[0].fName + " " + tempData[0].mName + " " + tempData[0].lName;
      let userName = tempData[0].businessName;
      let tempObj = { ...{ name: userName }, ...data };
      return tempObj;
    }));

    let finalStatsData=[]

    let finalStats = await Promise.all(salesDetails[0].salesPercentage.map(async (data) => {
      finalStatsData.push(data)
    }));
    

    res.status(200).json({ data:{finalData:finalData,stats:finalStatsData},status:200 });
  }
  catch(err){
    console.log(err)
    res.status(500).send({msg:"Internal server error", status: 500});
  }
}

module.exports = {dashboard, getDetailsCount, getSalesDeatils};
