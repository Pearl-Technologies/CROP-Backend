const business = require("../../../models/businessModel/business");
const adminBusinessCrop = require("../../../models/admin/admin_business_crop");
const invoiceAndPaymentNotification = require("../../../models/businessModel/businessNotification/invoiceAndPaymentNotification")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const {Product} = require('../../../models/businessModel/product')
const getLastFriday = require('../../../utils/dateHelper')
const stripe = require('stripe')(process.env.STRIPE_KEY);

const getAllBusiness = async (req, res) => {
  try {
    const businesses = await business.find({});
    res.status(200).json({ businesses });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const businessCrop = async (req, res) => {
  try {
    const { type, description, crop } = req.body;
    let user = req.user.user.id;
    if (type == "credit") {
      await adminBusinessCrop.create({
        credit: crop,
        description,
        user,
      });
      res.status(201).send("updated");
    } else if (type == "debit") {
      await adminBusinessCrop.create({
        debit: crop,
        description,
        user,
      });
      res.status(201).send("updated");
    } else {
      res.status(400).send("bad request! not updated");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const getAllBusinessCrop = async (req, res) => {
  try {
    let cropDetails = await adminBusinessCrop.find({});
    res.status(201).json({ cropDetails });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const updateBusinessAccountStatus = async (req, res) => {
  try {
    const {_id, status}=req.body;
    const findAccount = await business.findOne({_id});
    if(!findAccount){
      return res.status(404).json({msg:"no data found"});
    }
    await business.findByIdAndUpdate({_id}, {$set:{status}}, {new:true});
    res.status(202).json({msg:"updated successfully"});
  } catch (error) {
    console.log(error);
  }
};
const getAllBusinessByContent = async (req, res) => {
  let businessDetails;
  try {
    let { Zip_code, natureOfBusiness, businessName } = req.body;
    if (natureOfBusiness && businessName && Zip_code) {
      Zip_code = parseInt(Zip_code)
      businessDetails = await business.aggregate([
        {
          $unwind: {
            'path':'$address'
          },
        },
        {
          $match: {
            "address.pincode": Zip_code,
            'natureOfBusiness':{'$regex':natureOfBusiness},
            'businessName':{'$regex':businessName}
          },
        },
      ]);
      return res.status(200).json({ businessDetails });
    }
    if (natureOfBusiness && businessName) {
      businessDetails = await business.aggregate([
        {
          $unwind: {
            'path':'$address'
          },
        },
        {
          $match: {
            'natureOfBusiness':{'$regex':natureOfBusiness},
            'businessName':{'$regex':businessName}
          },
        },
      ]);
      return res.status(200).json({ businessDetails });
    }
    if (natureOfBusiness && Zip_code) {
      Zip_code = parseInt(Zip_code)
      businessDetails = await business.aggregate([
        {
          $unwind: {
            'path':'$address'
          },
        },
        {
          $match: {
            "address.pincode": Zip_code,
            "natureOfBusiness":{'$regex':natureOfBusiness}
          },
        },
      ]);
      console.log(businessDetails)
      return res.status(200).json({ businessDetails });
    }
    if (natureOfBusiness) {
      let businessDetails = await business.find({ natureOfBusiness:{$regex:natureOfBusiness} });
      return res.status(200).json({ businessDetails });
    }
    if (businessName) {
      businessDetails = await business.find({
        businessName:{$regex:businessName}
      });
      return res.status(200).json({ businessDetails });
    }
    if (Zip_code) {
      Zip_code = parseInt(Zip_code)
      businessDetails = await business.aggregate([
        {
          '$unwind': {
            'path':'$address'
          }
        },
        {
          '$match': {
            "address.pincode": Zip_code,
          },
        },
      ]);
     
      return res.status(200).json({ businessDetails });
    }
    businessDetails = await business.find();
    res.status(200).json({businessDetails});
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal error");
  }
};
const getPurchasedProductStatement = async (req, res) => {
  const {businessId} = req.body

  // console.log(new Date(getLastFriday()).toLocaleDateString(), "friday")
  try {
    const statement = await invoiceAndPaymentNotification.aggregate([
      {
        $match: {
          businessId: new ObjectId(businessId),
        },
      },
      {
        $match:{
          createdAt: {
            $gte: new Date(getLastFriday()),
            $lte: new Date()
          }
        }
      },
      {
        $lookup: {
          from: "customer_payment_trackers",
          localField: "purchaseOrder.orderId",
          foreignField: "_id",
          as: "orders",
        },
      },
      {
        $unwind: {
          path: "$orders",
        },
      },
      {
        $unwind: {
          path: "$orders.cartDetails.cartItems",
        },
      },
      {
        $addFields: {
          item: "$orders.cartDetails.cartItems",
        },
      },
      {
        $addFields: {
          user: "$item.user",
        },
      },
      {
        $match: {
          user: businessId,
        },
      }
    ])
    return res.status(200).send({ statement })
  } catch (error) {
    console.log(error)
    return res.status(500).send({msg:"Internal Server Error"})
  }
}
const getBusinessCropStatement = async (req, res) => {
  const {businessId} = req.body
  try {
    const statement = await invoiceAndPaymentNotification.aggregate([
      {
        $match: {
          businessId: new ObjectId(businessId),
        },
      },
      {
        $lookup: {
          from: "customer_payment_trackers",
          localField: "purchaseOrder.orderId",
          foreignField: "_id",
          as: "orders",
        },
      },
      {
        $unwind: {
          path: "$orders",
        },
      },
      {
        $unwind: {
          path: "$orders.cartDetails.cartItems",
        },
      },
      {
        $addFields: {
          item: "$orders.cartDetails.cartItems",
        },
      },
      {
        $addFields: {
          user: "$item.user",
        },
      },
      {
        $match: {
          user: businessId,
        },
      },{$sort: {createdAt:-1}}
    ])
    return res.status(200).send({ statement })
  } catch (error) {
    console.log(error)
    return res.status(500).send({msg:"Internal Server Error"})
  }
}
const getBusinessProductRated = async(req, res)=>{
  const { businessId } = req.query
  try {
    const productCommentsAndRatings = await Product.aggregate([
      {
        $match: { user: ObjectId(businessId) },
      },
      {
        $lookup: {
          from: "products_comments",
          localField: "_id",
          foreignField: "product_id",
          as: "comments",
        },
      },
      {
        $addFields: {
          details: { $arrayElemAt: ["$comments.details", 0] },
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ["$details.rating", []] } }, 0] },
              {
                $divide: [
                  {
                    $reduce: {
                      input: "$details.rating",
                      initialValue: 0,
                      in: { $add: ["$$value", "$$this"] },
                    },
                  },
                  { $size: "$details.rating" },
                ],
              },
              null,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          sector:1,
          image:1,
          comments: 1,
          averageRating: 1,
        },
      },
    ])
    return res.status(200).send({productCommentsAndRatings})
  } catch (error) {
    // console.log(error)
    return res.status(500).send({msg:"Internal Server Error"})
  }
}
const createStripeAccount = async()=>{
//   const account = await stripe.accounts.create({
//   country: 'AU',
//   type: 'custom',
//   capabilities: {
//     card_payments: {
//       requested: true,
//     },
//     transfers: {
//       requested: true,
//     },
//   },
// });
// const deleted = await stripe.accounts.del(
//   'acct_1N6rvnITspZWzEVQ'
// );
// console.log(deleted);
}
createStripeAccount()
module.exports = {
  getAllBusinessByContent,
  getAllBusiness,
  businessCrop,
  getAllBusinessCrop,
  updateBusinessAccountStatus,
  getPurchasedProductStatement,
  getBusinessCropStatement,
  getBusinessProductRated
};
