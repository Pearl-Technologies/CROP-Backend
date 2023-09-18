const { User } = require("../../../models/User");
const mongoose = require('mongoose');
const Order = require("../../../models/Order");
const adminCustomerCrop = require("../../../models/admin/admin_customer_crop");
const adminCustomerProp = require("../../../models/admin/admin_customer_prop");
const ObjectId = mongoose.Types.ObjectId;
// const random = require("alphanumeric");
const { num_uuid, num_uuidV2 } = require('num-uuid');
const {
  SaveMyPropTrasaction,
} = require("../../../controller/customerPropTransaction");
// let orderNumber = random(7);
let orderNumber = num_uuidV2(3, 6)
const {
  customerPaymentTracker,
  customerRedeemTracker,
  customerPropRedeemTracker,
  customerPurchsedTracker
} = require("../../../models/admin/PaymentTracker/paymentIdTracker");
const {productComment} = require("../../../models/businessModel/product")
const getAllCustomer = async (req, res) => {
  let {page}=req.body
  let limit=10
  try {
    const customers = await User.find({}).limit(limit).skip((page-1)*limit);
    const customerCount = await User.find({}).count();
    res.status(200).json({ customers, customerCount });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customers = await User.find({cropid:req.params.id});
    res.status(200).json({ customers });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const customerCrop = async (req, res) => {
  try {
    const { type, description, crop } = req.body;
    let user = req.user.user.id;
    if (type == "credit") {
      await adminCustomerCrop.create({
        credit: crop,
        description,
        user,
      });
      res.status(201).send("updated");
    } else if (type == "debit") {
      await adminCustomerCrop.create({
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
const getAllCustomerCrop = async (req, res) => {
  try {
    const cropDetails = await adminCustomerCrop.find({});
    res.status(200).json({ cropDetails });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const customerProp = async (req, res) => {
  try {
    const { type, description, crop } = req.body;
    let user = req.user.user.id;
    if (type == "credit") {
      await adminCustomerProp.create({
        credit: crop,
        description,
        user,
      });
      res.status(201).send("updated");
    } else if (type == "debit") {
      await adminCustomerProp.create({
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
const getAllCustomerProp = async (req, res) => {
  try {
    const propDetails = await adminCustomerProp.find({});
    res.status(200).json({ propDetails });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const updateCustomerStatus = async (req, res) => {
  const { _id, status } = req.body;
  try {
    const customer = await User.findOne({ _id });
    if (!customer) {
      return res.status(404).json({ msg: "no data found" });
    }
    await User.findByIdAndUpdate({ _id }, { status });
    res.status(200).json({ msg: "updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const getAllCustomerByContent = async (req, res) => {
  let customerDetails;
  try {
    // let { customerName, email, pincode } = req.body;
    // if (customerName && email && pincode) {
    //   Zip_code = parseInt(Zip_code)
    //   customerDetails = await business.aggregate([
    //     {
    //       $unwind: {
    //         'path':'$address'
    //       },
    //     },
    //     {
    //       $match: {
    //         "address.pincode": Zip_code,
    //         'natureOfBusiness':{'$regex':natureOfBusiness},
    //         'businessName':{'$regex':businessName}
    //       },
    //     },
    //   ]);
    //   return res.status(200).json({ businessDetails });
    // }
    // if (natureOfBusiness && businessName) {
    //   businessDetails = await business.aggregate([
    //     {
    //       $unwind: {
    //         'path':'$address'
    //       },
    //     },
    //     {
    //       $match: {
    //         'natureOfBusiness':{'$regex':natureOfBusiness},
    //         'businessName':{'$regex':businessName}
    //       },
    //     },
    //   ]);
    //   return res.status(200).json({ businessDetails });
    // }
    // if (natureOfBusiness && Zip_code) {
    //   Zip_code = parseInt(Zip_code)
    //   businessDetails = await business.aggregate([
    //     {
    //       $unwind: {
    //         'path':'$address'
    //       },
    //     },
    //     {
    //       $match: {
    //         "address.pincode": Zip_code,
    //         "natureOfBusiness":{'$regex':natureOfBusiness}
    //       },
    //     },
    //   ]);
    //   return res.status(200).json({ businessDetails });
    // }
    // if (natureOfBusiness) {
    //   let businessDetails = await business.find({ natureOfBusiness:{$regex:natureOfBusiness} });
    //   return res.status(200).json({ businessDetails });
    // }
    // if (businessName) {
    //   businessDetails = await business.find({
    //     businessName:{$regex:businessName}
    //   });
    //   return res.status(200).json({ businessDetails });
    // }
    // if (Zip_code) {
    //   Zip_code = parseInt(Zip_code)
    //   businessDetails = await business.aggregate([
    //     {
    //       '$unwind': {
    //         'path':'$address'
    //       }
    //     },
    //     {
    //       '$match': {
    //         "address.pincode": Zip_code,
    //       },
    //     },
    //   ]);

    //   return res.status(200).json({ businessDetails });
    // }
    customerDetails = await User.find({}, { name: 1, address: 1, email: 1 });
    res.status(200).json({ customerDetails });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "internal error" });
  }
};
const getAllCustomerForPropPayment = async (req, res) => {
  let userDetails = await User.aggregate([
    {
      $lookup: {
        from: "customer_crop_trasactions",
        localField: "_id",
        foreignField: "user",
        as: "result",
      },
    },
    {
      $project: {
        name: 1,
        cropid: 1,
        UserTier: 1,
        TierChangeDate: 1,
        total: {
          $reduce: {
            input: {
              $filter: {
                input: "$result",
                as: "data",
                cond: {
                  $and: [
                    {
                      $eq: ["$$data.transactionType", "credit"],
                    },
                  ],
                },
              },
            },
            initialValue: 0,
            in: {
              $add: [
                "$$value",
                {
                  $cond: {
                    if: {
                      $gt: ["$$this.createdAt", "$TierChangeDate"],
                    },
                    then: {
                      $add: ["$$this.crop"],
                    },
                    else: 0,
                  },
                },
              ],
            },
          },
        },
      },
    },
  ]);
  res.status(200).send({ userDetails });
};
const propPayment = async (message, quantity, user_id, milestone) => {
  if(!message || !quantity || !user_id ||!milestone){
    console.log("message, quantity, userId is required");
  } 
    try {
      let findAnUser = await User.findOne({ _id: user_id },{proppoints:1});
      let newPropPoint = findAnUser.proppoints
      if(findAnUser){
        newPropPoint += quantity
      }
      SaveMyPropTrasaction(
        quantity,
        quantity,
        "credit",
        message,
        orderNumber,
        user_id
      );
      if (milestone === 5000) {
        await User.findByIdAndUpdate(
          { _id: user_id },
          { $set: { fiveKCropMileStone: true, proppoints:newPropPoint } },
        );
      } else if (
        milestone === 10000
      ) {
        await User.findByIdAndUpdate(
          { _id: user_id },
          { $set: { tenKCropMileStone: true, proppoints:newPropPoint } }
        );
      } else if (
        milestone === 25000
      ) {
        await User.findByIdAndUpdate(
          { _id: user_id },
          { $set: { twentyFiveKCropMileStone: true, proppoints:newPropPoint } }
        );
      } else if (
        milestone >= 30000
      ) {
        await User.findByIdAndUpdate(
          { _id: user_id },
          {
            $set: {
              newMileStone:
                milestone + 5000,
                proppoints:newPropPoint
            },
          }
        );
      } else {
        console.log("milestone flag updation failed");
      }
      console.log("milestone payment transferred")
    } catch (err) {
      console.log(err)
    }
};
const PropPaymentNotification = async () => {
  let userDetails = await User.aggregate([
    {
      $lookup: {
        from: "customer_crop_trasactions",
        localField: "_id",
        foreignField: "user",
        as: "result",
      },
    },
    {
      $project: {
        name: 1,
        cropid: 1,
        UserTier: 1,
        TierChangeDate: 1,
        fiveKCropMileStone: 1,
        tenKCropMileStone: 1,
        twentyFiveKCropMileStone: 1,
        twentyFiveKPlusCropMileStone: 1,
        total: {
          $reduce: {
            input: {
              $filter: {
                input: "$result",
                as: "data",
                cond: {
                  $and: [
                    {
                      $eq: ["$$data.transactionType", "credit"],
                    },
                  ],
                },
              },
            },
            initialValue: 0,
            in: {
              $add: [
                "$$value",
                {
                  $cond: {
                    if: {
                      $gt: ["$$this.createdAt", "$TierChangeDate"],
                    },
                    then: {
                      $add: ["$$this.crop"],
                    },
                    else: 0,
                  },
                },
              ],
            },
          },
        },
      },
    },
  ]);
  userDetails.map((data) => {
    let quantity=0;
    let mileStone=0;
    if (data.total >= 5000 && data.total < 10000 && data.fiveKCropMileStone===false) {
      mileStone=5000;
      if (data.UserTier == "Blue" || data.UserTier == "Silver") {
        quantity = 50;
      } else if (data.UserTier == "Gold") {
        quantity = 55;
      } else if (data.UserTier == "Platinum") {
        quantity = 60;
      }
    } else if (data.total >= 10000 && data.total < 25000 && data.tenKCropMileStone===false) {
      mileStone=10000;
      if (data.UserTier == "Blue" || data.UserTier == "Silver") {
        quantity = 120;
      } else if (data.UserTier == "Gold") {
        quantity = 132;
      } else if (data.UserTier == "Platinum") {
        quantity = 144;
      }
    } else if (data.total >= 25000 && data.total < 30000 && data.twentyFiveKCropMileStone===false) {
      mileStone =25000
      if (data.UserTier == "Blue" || data.UserTier == "Silver") {
        quantity = 300;
      } else if (data.UserTier == "Gold") {
        quantity = 330;
      } else if (data.UserTier == "Platinum") {
        quantity = 360;
      }
    } else if (data.total > data.newMileStone) {
      mileStone =data.newMileStone
      qty = data.total - data.newMileStone;
      qty = qty / 5000;
      qty = Math.floor(qty);
      if (data.UserTier == "Blue" || data.UserTier == "Silver") {
        quantity = 60 * qty;
      } else if (data.UserTier == "Gold") {
        quantity = 66 * qty;
      } else if (data.UserTier == "Platinum") {
        quantity = 72 * qty;
      }
    }
    
    let message = `PROP for ${mileStone} achieved`
    if(quantity){
       propPayment(message, quantity, data._id, mileStone)
    }
  });
};
const productPurchaseTrasaction = async(req, res)=>{
  const { startDate, endDate, search, user } = req.query;
    // let token= req.headers.authorization
    // const token_data = await Token.findOne({ token });
    // let user= token_data?.user;
    // if(!user){
    //   return res
    //   .status(401)
    //   .send({ msg: "sorry you are not authorize",  status: 401 });
    // }
    try {
      let findone = await customerPaymentTracker.find({
        "cartDetails.user_id": mongoose.Types.ObjectId(`${user}`),
      });
      // console.log(findone);
      // return
      // if (!findone.length) {
      //   return res
      //     .status(200)
      //     .send({ msg: "no order", data: findone, status: 200 });
      // }
      // if (startDate && endDate) {
      //   const trasactionDetails = await customerPaymentTracker.aggregate([
      //     {
      //       $match: {
      //         user: { $eq: findone[0].user },
      //       },
      //     },
      //     {
      //       $match: {
      //         createdAt: {
      //           $gte: new Date(startDate),
      //           $lte: new Date(endDate),
      //         },
      //       },
      //     },        
      //     {
      //       $project: {
      //         status: 1,
      //         paymentMethod: 1,
      //         invoice_url: 1,
      //         invoice_pdf: 1,
      //         customer_email:1,
      //         coupon_code:1,
      //         number:1,
      //         customer_address:1,
      //         customer_shipping:1,
      //         cartDetails:1,
      //         updatedAt:1
      //       },
      //     },
      //     { $sort: { createdAt: -1 } },
      //   ]);
      //   return res.status(200).send({ data: trasactionDetails, status: 200 });
      // }
      // if (search) {
      //   const trasactionDetails = await customerPaymentTracker.aggregate([
      //     {
      //       $match: {
      //         user: { $eq: findone[0].user },
      //       },
      //     },
      //     {
      //       $project: {
      //         status: 1,
      //         paymentMethod: 1,
      //         invoice_url: 1,
      //         invoice_pdf: 1,
      //         customer_email:1,
      //         coupon_code:1,
      //         number:1,
      //         customer_address:1,
      //         customer_shipping:1,
      //         cartDetails:1,
      //         updatedAt:1
      //       },
      //     },
      //     {
      //       $match: {
      //         orderNumber: search,
      //       },
      //     },
      //     { $sort: { createdAt: -1 } },
      //   ]);
      //   return res.status(200).send({ data: trasactionDetails, status: 200 });
      // }
  
      const trasactionDetails = await customerPaymentTracker.aggregate([
        {
          $match: {
            "cartDetails.user_id": mongoose.Types.ObjectId(`${user}`),
          },
        },
        {
          $match: {
            "status": "paid",
          },
        },
        {
          $unwind:{            
              path: "$cartDetails.cartItems",            
          }
        },
        {
          $project: {
            invoice_pdf:1,
            invoice_url:1,
            number:1,
            "cartDetails.cartItems":1,
            updatedAt:1,
            customer_shipping:1,
            customer_address:1
          },
        },
        { $sort: { updatedAt: -1 } },
      ]);
      return res.status(200).send({ data: trasactionDetails, status: 200 });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "internal server error", status: 500 });
    }
}
const pointPurchaseTrasaction = async(req, res)=>{
  const { startDate, endDate, search, user } = req.query;
    // let token= req.headers.authorization
    // const token_data = await Token.findOne({ token });
    // let user= token_data?.user;
    if(!user){
      return res
      .status(401)
      .send({ msg: "sorry you are not authorize",  status: 401 });
    }
    try {
      let findone = await customerPurchsedTracker.find({
        user: mongoose.Types.ObjectId(`${user}`),
      });
      if (!findone.length) {
        return res
          .status(200)
          .send({ msg: "no order", data: findone, status: 200 });
      }
      if (startDate && endDate) {
        const trasactionDetails = await customerPurchsedTracker.aggregate([
          {
            $match: {
              user: { $eq: findone[0].user },
            },
          },
          {
            $match: {
              createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              },
            },
          },        
          {
            $project: {
              status: 1,
              paymentMethod: 1,
              invoice_url: 1,
              invoice_pdf: 1,
              customer_email:1,
              type:1,
              amount:1,
              quantity:1,
              name:1,
              createdAt:1
            },
          },
          { $sort: { createdAt: -1 } },
        ]);
        return res.status(200).send({ data: trasactionDetails, status: 200 });
      }
      if (search) {
        const trasactionDetails = await customerPurchsedTracker.aggregate([
          {
            $match: {
              user: { $eq: findone[0].user },
            },
          },
          {
            $project: {
              status: 1,
              paymentMethod: 1,
              invoice_url: 1,
              invoice_pdf: 1,
              customer_email:1,
              type:1,
              amount:1,
              quantity:1,
              name:1,
              createdAt:1
            },
          },
          { $sort: { createdAt: -1 } },
        ]);
        return res.status(200).send({ data: trasactionDetails, status: 200 });
      }
  
      const trasactionDetails = await customerPurchsedTracker.aggregate([
        {
          $match: {
            user: { $eq: findone[0].user },
          },
        },
        {
          $match: {
            status: "paid",
          },
        },
        {
          $project: {
            invoice_url: 1,
            invoice_pdf: 1,
            type:1,
            amount:1,
            quantity:1,
            name:1,
            createdAt:1
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      return res.status(200).send({ data: trasactionDetails, status: 200 });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "internal server error", status: 500 });
    }
}
const getAllLikedProductByUser =async(req, res)=>{
    const {customerId} =req.body
    // console.log(customerId); 
    // res.send("ok")
    // return
try {
  const product = await productComment.aggregate(
    [
      {
          '$unwind': {
              'path': '$product_likes'
          }
      }, {
          '$match': {
              'product_likes.user_id': ObjectId(customerId)
          }
      }, {
          '$match': {
              'product_likes.like': true
          }
      }, {
          '$lookup': {
              'from': 'business_products', 
              'localField': 'product_id', 
              'foreignField': '_id', 
              'as': 'likedProduct'
          }
      },{
        '$project':{
          'likedProduct':1
        }
      }
  ]
  )
  return res.status(200).send({product});
} catch (error) {
  console.log(error);
  return res.status(500).send({msg:"internal error"})
}
}
const getAllRatedProductByUser =async(req, res)=>{
  const {customerId} =req.body
try {
const product = await productComment.aggregate(
  [
    {
        '$unwind': {
            'path': '$details'
        }
    }, {
        '$match': {
            'details.user_id': ObjectId(customerId)
        }
    }, {
        '$match': {
            'details.status': true
        }
    }, {
        '$lookup': {
            'from': 'business_products', 
            'localField': 'product_id', 
            'foreignField': '_id', 
            'as': 'ratedProduct'
        }
    },{
      '$project':{
        details:1,
        ratedProduct:1
      }
    }
]
)
return res.status(200).send({product});
} catch (error) {
console.log(error);
return res.status(500).send({msg:"internal error"})
}
}

module.exports = {
  PropPaymentNotification,
  getAllCustomerByContent,
  getAllCustomer,
  getCustomerById,
  getAllOrders,
  customerProp,
  customerCrop,
  getAllCustomerProp,
  getAllCustomerCrop,
  updateCustomerStatus,
  getAllCustomerForPropPayment,
  productPurchaseTrasaction,
  pointPurchaseTrasaction,
  getAllLikedProductByUser,
  getAllRatedProductByUser
};
