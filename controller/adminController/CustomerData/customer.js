const stripe = require("stripe")(process.env.STRIPE_KEY);
const { User } = require("../../../models/User");
const Order = require("../../../models/Order");
const adminCustomerCrop = require("../../../models/admin/admin_customer_crop");
const adminCustomerProp = require("../../../models/admin/admin_customer_prop");
const schedule = require("node-schedule");
const adminPropValuation =require("../../../models/admin/admin_prop_valuation")
const {adminPropPaymentOnMilestoneTracker} = require("../../../models/admin/PaymentTracker/paymentIdTracker")


const getAllCustomer = async (req, res) => {
  try {
    const customers = await User.find({});
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
  let details = await adminPropValuation.find({})
  let value = details[0].purchaseProp
    try {
      let findOneLink = await adminPropPaymentOnMilestoneTracker.findOne({$and:[{user:user_id}, {milestone}]})
      if(findOneLink){
        console.log("already exist")
        return       
      } 
      
      const product = await stripe.products.create({
        name: message,
      });
      const price = await stripe.prices.create({
        unit_amount: value*100,
        currency: "aud",
        product: product.id,
        tax_behavior: "inclusive",
      });

      const payment_Link = await stripe.paymentLinks.create({
        line_items: [
          {
            price: price.id,
            quantity: quantity,
          },
        ],
        invoice_creation: {
          enabled: true,
          invoice_data: {
            rendering_options: {
              amount_tax_display: "include_inclusive_tax",
            },
            footer: "milestone",
          },
        },
        after_completion: {
          type: "redirect",
          redirect: { url: "http://localhost:3000/success" },
        },
      });

      if(payment_Link){
        await adminPropPaymentOnMilestoneTracker.create(
          {
            paymentLink: payment_Link.id,
            status:"unpaid",
            paymentUrl:payment_Link.url,
            type:message,
            amount: quantity*value,
            quantity:quantity,
            user:user_id,
            milestone,            
          }
        );
      }
      console.log("created")
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
      if (data.UserTier == "Base" || data.UserTier == "Silver") {
        quantity = 50;
      } else if (data.UserTier == "Gold") {
        quantity = 55;
      } else if (data.UserTier == "Platinum") {
        quantity = 60;
      }
    } else if (data.total >= 10000 && data.total < 25000 && data.tenKCropMileStone===false) {
      mileStone=10000;
      if (data.UserTier == "Base" || data.UserTier == "Silver") {
        quantity = 120;
      } else if (data.UserTier == "Gold") {
        quantity = 132;
      } else if (data.UserTier == "Platinum") {
        quantity = 144;
      }
    } else if (data.total >= 25000 && data.total < 30000 && twentyFiveKCropMileStone===false) {
      mileStone =25000
      if (data.UserTier == "Base" || data.UserTier == "Silver") {
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
      if (data.UserTier == "Base" || data.UserTier == "Silver") {
        quantity = 60 * qty;
      } else if (data.UserTier == "Gold") {
        quantity = 66 * qty;
      } else if (data.UserTier == "Platinum") {
        quantity = 72 * qty;
      }
    }
    
    let message = `PROP for ${mileStone} achieved`
    console.log(quantity);
    if(quantity){
       propPayment(message, quantity, data._id, mileStone)
    }
  });
};
PropPaymentNotification();
module.exports = {
  getAllCustomerByContent,
  getAllCustomer,
  getAllOrders,
  customerProp,
  customerCrop,
  getAllCustomerProp,
  getAllCustomerCrop,
  updateCustomerStatus,
  getAllCustomerForPropPayment,
};
