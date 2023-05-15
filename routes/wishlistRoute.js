const express = require("express");
const router = express.Router();
const { Wishlist } = require("../models/Wishlist");
const { Product } = require("../models/businessModel/product");
const { User } = require("../models/User");
const { Token } = require("../models/User");
const { StoreProduct } = require("../models/businessModel/storeproducts");
const mongoose = require("mongoose");

const getPromoProducts = async (temp_id, page, limit) => {
  const skip = (page - 1) * limit;
  try {
    const promoProducts = await Product.find({
      _id: mongoose.Types.ObjectId(temp_id),
      mktOfferFor: "promo",
      market: true,
    })
      .skip(skip)
      .limit(limit);
    const count = await Product.find({
      _id: mongoose.Types.ObjectId(temp_id),
      mktOfferFor: "promo",
      market: true,
    }).countDocuments();
    return promoProducts[0]._doc;
  } catch (error) {
    console.log(error);
  }
};

const getEarnCropSingleProductById = async (temp_id) => {
  try {
    const dateTime = new Date();
    const sDate = dateTime.toISOString();
    const today = sDate.split("T")[0];
    // console.log(dateTime.getDay(), "day");
    const currentDay = dateTime.getDay();
    const t = dateTime.toLocaleString("en-GB").split(" ");
    const th = t[1].split(":");
    const time = th[0] + ":" + th[1];
    if (currentDay == 0) {
      day = "sun";
    } else if (currentDay == 1) {
      day = "mon";
    } else if (currentDay == 2) {
      day = "tue";
    } else if (currentDay == 3) {
      day = "wed";
    } else if (currentDay == 4) {
      day = "thu";
    } else if (currentDay == 5) {
      day = "fri";
    } else if (currentDay == 6) {
      day = "sat";
    }
    const id = temp_id.toString();
    console.log(typeof id);
    const product = await Product.aggregate([
      { $match: { _id: { $eq: mongoose.Types.ObjectId(id) } } },
      {
        $lookup: {
          from: "business_croprules",
          localField: "user",
          foreignField: "businessId",
          as: "cropRules",
        },
      },
      { $unwind: "$cropRules" },
      {
        $lookup: {
          from: "business_bonuscrops",
          localField: "_id",
          foreignField: "bonusCropProducts.productId",
          as: "bonusCrops",
        },
      },

      {
        $lookup: {
          from: "business_happyhours",
          localField: "_id",
          foreignField: "happyHoursProducts.productId",
          as: "happyHours",
        },
      },

      {
        $lookup: {
          from: "business_services",
          localField: "user",
          foreignField: "businessId",
          as: "services",
        },
      },

      {
        $addFields: {
          ruleAppliedCrops: {
            $multiply: ["$croppoints", "$cropRules.cropPerAudCredit"],
          },
        },
      },

      {
        $addFields: {
          bonusCropsDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  [{ $lte: ["$bonusCrops.bonusCrop.fromDate", today] }],
                  [{ $gte: ["$bonusCrops.bonusCrop.toDate", today] }],
                  [`$bonusCrops.bonusCropDays.${day}`],
                ],
              },
              then: { $sum: `$bonusCrops.bonusCropPercentage` },
              else: [`$bonusCrops.bonusCropDays.${day}`, day],
            },
          },
        },
      },
      {
        $addFields: {
          happyHoursDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  [{ $lte: ["$happyHours.happyHoursDates.fromDate", today] }],
                  [{ $gte: ["$happyHours.happyHoursDates.toDate", today] }],
                  // [`$happyHours.happyHoursDays.${day}`]
                  [{ $lte: ["$happyHours.happyHoursTime.startTime", time] }],
                  [{ $gte: ["$happyHours.happyHoursTime.endTime", time] }],
                ],
              },
              then: { $sum: "$happyHours.happyHoursPercentage" },
              else: [`$happyHours.happyHoursDay.${day}`, day],
            },
          },
        },
      },
      {
        $addFields: {
          happyHoursAndExtendBonusAddedPercentage: {
            $add: [
              "$bonusCropsDiscountPercentage",
              "$happyHoursDiscountPercentage",
            ],
          },
        },
      },
      // { $cond: [ { $eq: [ "$happyHoursAndExtendBonusAddedPercentage", 0 ] }, "$ruleAppliedCrops", {$divide:["$upvotes", "$downvotes"]} ] }
      {
        $addFields: {
          cropRulesWithBonus: {
            $cond: [
              { $eq: ["$happyHoursAndExtendBonusAddedPercentage", 0] },
              "$ruleAppliedCrops",
              {
                $add: [
                  "$ruleAppliedCrops",
                  {
                    $divide: [
                      {
                        $multiply: [
                          "$ruleAppliedCrops",
                          "$happyHoursAndExtendBonusAddedPercentage",
                        ],
                      },
                      100,
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      // {$unwind: "$bonusCrops"},
      {
        $project: {
          title: 1,
          originalPrice: 1,
          discount: 1,
          price: 1,
          quantity: 1,
          crops: "$croppoints",
          description: 1,
          brand: 1,
          user: 1,
          customiseMsg: 1,
          user: 1,
          apply: 1,
          image: 1,
          cropRules: { cropPerAudCredit: 1 },
          ruleAppliedCrops: "$ruleAppliedCrops",
          bonusCropsDiscountPercentage: "$bonusCropsDiscountPercentage",
          happyHoursDiscountPercentage: "$happyHoursDiscountPercentage",
          happyHoursAndExtendBonusAddedPercentage:
            "$happyHoursAndExtendBonusAddedPercentage",
          cropRulesWithBonus: "$cropRulesWithBonus",
          // services: 1,
          // happyHours: 1,
          // bonusCrops: 1,
        },
      },
    ]);
    return product[0];
  } catch (error) {
    console.log(error);
  }
};

const getRedeemCropSingleProductById = async (temp_id) => {
  try {
    const dateTime = new Date();
    const sDate = dateTime.toISOString();
    const today = sDate.split("T")[0];
    const currentDay = dateTime.getDay();
    console.log("2023-04-13" < today, "Strat Date");
    console.log("2023-04-14" > today, "End Date");
    let day = "";
    if (currentDay == 0) {
      day = "sun";
    } else if (currentDay == 1) {
      day = "mon";
    } else if (currentDay == 2) {
      day = "tue";
    } else if (currentDay == 3) {
      day = "wed";
    } else if (currentDay == 4) {
      day = "thu";
    } else if (currentDay == 5) {
      day = "fri";
    } else if (currentDay == 6) {
      day = "sat";
    }
    const id = temp_id.toString();
    console.log({ id });
    const product = await Product.aggregate([
      { $match: { _id: { $eq: mongoose.Types.ObjectId(id) } } },
      {
        $sort: {
          bidPrice: -1,
          rating: -1,
          likes: -1,
        },
      },
      {
        $lookup: {
          from: "business_croprules",
          localField: "user",
          foreignField: "businessId",
          as: "cropRules",
        },
      },
      {
        $lookup: {
          from: "business_slashredemptioncrops",
          localField: "_id",
          foreignField: "slashRedemptionProducts.productId",
          as: "slashRedemption",
        },
      },
      { $unwind: "$cropRules" },
      {
        $addFields: {
          ruleAppliedCrops: {
            $multiply: ["$redeemCROPs", "$cropRules.cropPerAudDebit"],
          },
        },
      },

      {
        $addFields: {
          slashRedemptionDiscountPercentage: {
            $cond: {
              if: {
                $and: [
                  {
                    $lte: ["2023-04-23", today],
                  },
                  {
                    $gte: ["2023-04-29", today],
                  },
                  {
                    $eq: [true, true],
                  },
                ],
              },
              then: { name: `$slashRedemption.slashRedemptionDays.${day}` },
              else: [`$slashRedemption.slashRedemptionDays.${day}`, day],
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          originalPrice: 1,
          discount: 1,
          price: 1,
          quantity: 1,
          image: 1,
          rating: 1,
          likes: 1,
          bidPrice: 1,
          image: 1,
          user: 1,
          cropRules: { cropPerAudDebit: 1 },
          ruleAppliedCrops: "$ruleAppliedCrops",
          slashRedemptionDiscountPercentage: 1,
          cropRulesWithSlashRedemption: "$cropRulesWithSlashRedemption",
          customiseMsg: 1,
          brand: 1,
          description: 1,
          apply: 1,
        },
      },
    ]);
    return product[0];
  } catch (error) {
    console.log(error);
  }
};

// router.put("/cartdetails", async (req, res) => {
//   try {
//     let token = req.headers.authorization;

//     const token_data = await Token.findOne({ token: token });
//     const userData = token_data
//       ? await User.findOne({ _id: token_data.user })
//       : null;
//     const user = userData?._id.valueOf();
//     const products = req.body.products;

//     const userdetails = await Wishlist.findOne({
//       user_id: user,
//     });

//     if (userdetails) {
//       let productCheck = userdetails._doc.Wishlist.findIndex((data) => {
//         return data._id == products._id;
//       });

//       if (productCheck == -1) {
//         const result = await Wishlist.updateOne(
//           { user_id: user },
//           { $push: { Wishlist: products } }
//         );
//         return res
//           .status(200)
//           .send({ status: true, message: "Wishlist Added Succesfully" });
//       } else if (productCheck >= 0) {
//         return res
//           .status(200)
//           .send({ status: true, message: "Product already in wishlist" });
//       } else {
//         return res
//           .status(500)
//           .send({ status: true, message: "User not found" });
//       }
//     } else {
//       const newCart = new Wishlist({
//         user_id: mongoose.Types.ObjectId(user),
//         Wishlist: products,
//       });
//       await newCart.save();
//       res.status(200).send({
//         message: "Wishlist Added Successfully",
//         status: "true",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       message: "Internal server error",
//       status: "false",
//     });
//   }
// });

router.put("/cartdetails", async (req, res) => {
    try {
        let token = req.headers.authorization;
        const token_data = await Token.findOne({"token":token});
        const userData= token_data ? await User.findOne({_id:token_data.user}) : null; 
        const user_id = userData?._id.valueOf();
        const products = req.body.products
        console.log(products)

        const userdetails = await Wishlist.findOne({
            user_id: user_id
        });

        if (userdetails) {

            const findCartProduct = await Wishlist.findOne(
                {"Wishlist._id":products._id,"user_id":user_id}
            )
    
            if(findCartProduct){
                const result = await Wishlist.updateOne({"Wishlist._id":products._id,"user_id":user_id}, { $inc : { "Wishlist.$.cartQuantity": 1 } });
                console.log(result);
                return res.status(200).send({    message: 'Wishlist Added Successfully',status: true })
            }

            else{
            const finalProduct = {...products,...{cartQuantity:1,purchaseStatus:0}}
            const result = await Wishlist.updateOne({ user_id: user_id }, { $push: { Wishlist: finalProduct } });
            console.log(result);
            return res.status(200).send({    message: 'Wishlist Added Successfully',status: true })
            }
        }
        else {
            const finalProduct = {...products,...{cartQuantity:1,purchaseStatus:0}}
            const newCart = new Wishlist({ user_id: mongoose.Types.ObjectId(user_id), Wishlist: finalProduct });
            await newCart.save();
            res.status(200).send({
                message: 'Wishlist Added Successfully',
                status: "true",
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Internal server error", status: "false"
        })
    }
});

// router.put("/updateCart",async(req,res) => {
//     try {
//         //product_id, user_id, item_count
//         const newCart = new Cart.updateOne({product_id: req.body.product_id, user_id: req.body.user_id}, {$set: {item_count: req.body.item_count}});
//         await newCart.save();
//         res.send({
//         message:'Cart Updated Successfully',
//         });
//     }
//     catch(err) {
//         res.status(500).send({
//             message:err.message
//         })
//     }
// });

router.put("/deleteCart", async (req, res) => {
  const product_id = req.body.product_id;
  let token = req.headers.authorization;

  const token_data = await Token.findOne({ token: token });
  const userData = await User.findOne({ _id: token_data.user });
  const user = userData._id.valueOf();

  try {
    await Wishlist.updateOne(
      { user_id: user },
      { $pull: { Wishlist: { _id: product_id } } }
    );
    res.status(200).send({
      message: " Item Deleted Successfully",
      status: "true",
    });
  } catch (err) {
    res.status(500).send({
      message: "Internal server error",
      status: "false",
    });
  }
});

// router.get("/getCart",async(req,res) => {
//     try{
//         let token=req.headers.authorization;
//         console.log("santhosh", token)
//         const token_data = await Token.findOne({"token":token});
//         const userData=await User.findOne({_id:token_data.user});
//         const user=userData._id.valueOf();
//         const newCart = await Wishlist.findOne({user_id:user});
//         console.log(newCart);
//         if(newCart == null){
//             res.status(200).send({ data: [], status: "true" })
//         }else{
//             res.status(200).send({data:newCart,status:"true"})
//         }
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).send({data:err,status:false})
//     }

// });

router.get("/getCart", async (req, res) => {
  // try{
  //     let token = req.headers.authorization;
  //     console.log("santhosh", token)
  //     const token_data = await Token.findOne({"token":token});
  //     const userData=await User.findOne({_id:token_data.user});
  //     const user_id = userData._id.valueOf();
  //     const newCart = await Cart.findOne({ user_id: user_id });
  //     console.log(newCart);
  //     if(newCart == null){
  //         res.status(200).send({ data: [], status: "true" })
  //     }else{
  //         res.status(200).send({ data: newCart, status: "true" })
  //     }
  // }
  try {
    const token = req.headers.authorization;
    const type = req.query.type;
    console.log("santhosh", token);
    let cartObj = {};
    const token_data = await Token.findOne({ token });
    if (token_data) {
      // const userData = await User.findOne({ _id: token_data.user });
      // const user_id = userData._id.valueOf();
      const userData = token_data
        ? await User.findOne({ _id: token_data.user })
        : null;
      const user_id = userData?._id.valueOf();
      const newCart = await Wishlist.findOne({ user_id });
      const tempCart = [];
      var subtotal = 0;
      var redeemtotal = 0;
      var storetotal = 0;
      if (newCart) {
        for (const data of newCart._doc.Wishlist) {
          var temp_redeem = 0;
          var temp_price = 0;
          try {
            if (
              data.mktOfferFor == "promo" &&
              data.purchaseStatus == 0 &&
              type == 1
            ) {
              const products = await getPromoProducts(
                data._id,
                1,
                newCart._doc.Wishlist.length
              );
              temp_price = products.price * data.cartQuantity;
              if (products.redeemCROPs != null) {
                temp_redeem = products.redeemCROPs * data.cartQuantity;
              }
              subtotal = subtotal + temp_price;
              redeemtotal = redeemtotal + temp_redeem;
              const finalProduct = {
                ...products,
                ...{
                  cartQuantity: data.cartQuantity,
                  purchaseStatus: data.purchaseStatus,
                  tempPrice: temp_price,
                  tempRedeem: temp_redeem,
                },
              };
              tempCart.push(finalProduct);
            } else if (
              data.apply == "earnCrop" &&
              data.purchaseStatus == 0 &&
              type == 2
            ) {
              const products = await getEarnCropSingleProductById(data._id);
              let temp_price = products.price * data.cartQuantity;
              subtotal = subtotal + temp_price;
              const finalProduct = {
                ...products,
                ...{
                  cartQuantity: data.cartQuantity,
                  purchaseStatus: data.purchaseStatus,
                  tempPrice: temp_price,
                },
              };
              tempCart.push(finalProduct);
            } else if (
              data.apply == "redeemCrop" &&
              data.purchaseStatus == 0 &&
              type == 3
            ) {
              // const products = await getRedeemCropSingleProductById(data.mktOfferFor, data.sector, 1, newCart._doc.cart.length);
              const products = await getRedeemCropSingleProductById(data._id);
              let temp_price = products.price * data.cartQuantity;
              if (products.ruleAppliedCrops != null) {
                temp_redeem = products.ruleAppliedCrops * data.cartQuantity;
              }
              subtotal = subtotal + temp_price;
              redeemtotal = redeemtotal + temp_redeem;
              const finalProduct = {
                ...products,
                ...{
                  cartQuantity: data.cartQuantity,
                  purchaseStatus: data.purchaseStatus,
                  tempPrice: temp_price,
                  tempRedeem: temp_redeem,
                },
              };
              tempCart.push(finalProduct);
            } else if (data.purchaseStatus == 0 && type == 4) {
              const store = await StoreProduct.findById({
                _id: data._id,
              });
              let temp_redeem = store.redeemProps * data.cartQuantity;
              storetotal = storetotal + temp_redeem;
              const finalProduct = {
                ...store._doc,
                ...{
                  cartQuantity: data.cartQuantity,
                  purchaseStatus: data.purchaseStatus,
                  tempRedeem: temp_redeem,
                },
              };
              tempCart.push(finalProduct);
              // return res.status(200).send({ finalProduct, store })
            }
          } catch (err) {
            console.error(err);
          }
        }
        if (tempCart.length <= 0) {
          res.status(200).send({ data: [], status: "true" });
        } else {
          res.status(200).send({
            data: {
              _id: newCart._id,
              user_id: newCart.user_id,
              cart: tempCart,
              storetotal,
              subtotal: subtotal,
              redeemtotal: redeemtotal,
            },
            status: "true",
          });
        }
      } else {
        res.status(200).send({ message: "No cart found", status: false });
      }
    } else {
      res
        .status(500)
        .send({ message: "Authorization required", status: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ data: err, status: false });
  }
});

module.exports = router;
