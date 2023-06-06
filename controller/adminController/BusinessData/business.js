const business = require("../../../models/businessModel/business");
const adminBusinessCrop = require("../../../models/admin/admin_business_crop");
const invoiceAndPaymentNotification = require("../../../models/businessModel/businessNotification/invoiceAndPaymentNotification")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const {Product} = require('../../../models/businessModel/product')
const getLastFriday = require('../../../utils/dateHelper')
const stripe = require('stripe')(process.env.STRIPE_KEY);
const {customerPaymentTracker} = require("../../../models/admin/PaymentTracker/paymentIdTracker")
const {BusinessHolidays} = require("../../../models/businessModel/businessHolidays")
const Admin = require("../../../models/superAdminModel/user");
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

const getBusinessProductRatedAll = async(req, res)=>{
  try {
    const productCommentsAndRatings = await Product.aggregate([
      // {
      //   $match: { user: ObjectId(businessId) },
      // },
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
const getBusinessOfferedPoint = async(req, res)=>{
  const user_id = req.user.user.id;
  const {businessId} = req.body;
  const offeredCrop = await customerPaymentTracker.aggregate(
    [
      {
        '$match': {
          'status': 'paid'
        }
      }, {
        '$unwind': {
          'path': '$cartDetails.cartItems'
        }
      }, {
        '$addFields': {
          'total': {
            '$multiply': [
              '$cartDetails.cartItems.cartQuantity', '$cartDetails.cartItems.cropRulesWithBonus'
            ]
          }
        }
      }, {
        '$match': {
          'cartDetails.cartItems.services.businessId': businessId
        }
      }, {
        '$group': {
          '_id': '$status', 
          'count': {
            '$sum': {
              '$add': '$total'
            }
          }
        }
      }
    ]
  )
}
const getAllHolidays = async(req, res)=>{
    let user_id = (req.user.user.id);
    try {
      let findUser = await Admin.findOne({_id:user_id})
      if(!findUser){
        return res.status(401).send({"msg":"sorry, you are not authorize"})
      }
      let holidays = await BusinessHolidays.find({},{holidayDate:1, holidayName:1, state:1});
      console.log(holidays);
      res.status(200).send({holidays});
      return
      
    } catch (error) {
      console.log(error);
      return res.status(5000).send({"msg":"internal error"})
    }

}
const addHoiday = async(req, res)=>{
  let user_id = (req.user.user.id);
  let {holidayDate, holidayName, state} = req.body
  try {
    let findUser = await Admin.findOne({_id:user_id})
    if(!findUser){
      return res.status(401).send({"msg":"sorry, you are not authorize"})
    }
    if(!holidayDate && !holidayName && !state ){
      return res.status(401).send({"msg":"sorry, all field is required"})
    }
    let holidays = await BusinessHolidays.create({holidayDate, holidayName, state});
    res.status(200).send({"msg":"Holiday added successfully"});
    return
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({"msg":"internal error"})
  }

}
const updateHoliday = async(req, res)=>{
  let user_id = (req.user.user.id);
  let {holidayDate, holidayName, state, _id} = req.body
  try {
    let findUser = await Admin.findOne({_id:user_id})
    if(!findUser){
      return res.status(401).send({"msg":"sorry, you are not authorize"})
    }
    if(!holidayDate && !holidayName && !state ){
      return res.status(401).send({"msg":"sorry, all field is required"})
    }
    let holidays = await BusinessHolidays.findByIdAndUpdate({_id}, {$set:{holidayDate, holidayName, state}});
    res.status(200).send({"msg":"Holiday updated successfully"});
    return
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({"msg":"internal error"})
  }

}
const deleteHoliday = async(req, res)=>{
  let user_id = (req.user.user.id);
  let {_id} = req.body
  try {
    let findUser = await Admin.findOne({_id:user_id})
    if(!findUser){
      return res.status(401).send({"msg":"sorry, you are not authorize"})
    }
    if(!_id ){
      return res.status(401).send({"msg":"id not found"})
    }
    let holidays = await BusinessHolidays.findByIdAndDelete({_id});
    res.status(200).send({"msg":`${holidays.holidayName} Holiday deleted successfully`});
    return
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({"msg":"internal error"})
  }

}
module.exports = {
  getAllBusinessByContent,
  getAllBusiness,
  businessCrop,
  getAllBusinessCrop,
  updateBusinessAccountStatus,
  getPurchasedProductStatement,
  getBusinessCropStatement,
  getBusinessProductRated,
  getBusinessProductRatedAll,
  getAllHolidays,
  addHoiday,
  updateHoliday,
  deleteHoliday
};
