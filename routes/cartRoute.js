const express = require('express')
const router = express.Router();
const { Cart } = require("../models/Cart")
const { Product } = require("../models/businessModel/product")
const { User } = require("../models/User");
const {Token} = require("../models/User");
const mongoose = require('mongoose');
const { getEarnCropProductsBySector } = require("../controller/businessController/product");

const getPromoProducts = async (temp_id,page,limit) => {
  
    const skip = (page - 1) * limit
    try {
      const promoProducts = await Product.find({
        _id:mongoose.Types.ObjectId(temp_id),
        mktOfferFor: "promo",
        market: true,
      })
        .skip(skip)
        .limit(limit)
      const count = await Product.find({
        _id:mongoose.Types.ObjectId(temp_id),
        mktOfferFor: "promo",
        market: true,
      }).countDocuments()
      return promoProducts[0]._doc
    } catch (error) {
      console.log(error)
    }
  }

  const getEarnCropSingleProductById = async (temp_id) => {
    try {
      const dateTime = new Date()
      const sDate = dateTime.toISOString()
      const today = sDate.split("T")[0]
      // console.log(dateTime.getDay(), "day");
      const currentDay = dateTime.getDay()
      const t = dateTime.toLocaleString("en-GB").split(" ")
      const th = t[1].split(":")
      const time = th[0] + ":" + th[1]
      if (currentDay == 0) {
        day = "sun"
      } else if (currentDay == 1) {
        day = "mon"
      } else if (currentDay == 2) {
        day = "tue"
      } else if (currentDay == 3) {
        day = "wed"
      } else if (currentDay == 4) {
        day = "thu"
      } else if (currentDay == 5) {
        day = "fri"
      } else if (currentDay == 6) {
        day = "sat"
      }
      const id = temp_id.toString()
      console.log(typeof id)
      const product = await Product.aggregate([
        { $match: { _id: { $eq:mongoose.Types.ObjectId(id) } } },
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
      ])
      return product[0]
    } catch (error) {
      console.log(error)
    }
  }

  const getRedeemCropSingleProductById = async (temp_id) => {
    try {
      const dateTime = new Date()
      const sDate = dateTime.toISOString()
      const today = sDate.split("T")[0]
      const currentDay = dateTime.getDay()
      console.log("2023-04-13" < today, "Strat Date")
      console.log("2023-04-14" > today, "End Date")
      let day = ""
      if (currentDay == 0) {
        day = "sun"
      } else if (currentDay == 1) {
        day = "mon"
      } else if (currentDay == 2) {
        day = "tue"
      } else if (currentDay == 3) {
        day = "wed"
      } else if (currentDay == 4) {
        day = "thu"
      } else if (currentDay == 5) {
        day = "fri"
      } else if (currentDay == 6) {
        day = "sat"
      }
      const id = temp_id.toString();
      console.log({ id })
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
      ])
      return product[0]
    } catch (error) {
      console.log(error)
    }
  }

router.put("/quantity", async (req, res) => {

    try {
        let quantity = req.body.quantity;
        let id = req.body.id;
        let cart_id = req.body.cart_id;
        let token = req.headers.authorization;
        const token_data = await Token.findOne({"token":token});
        const userData=await User.findOne({_id:token_data.user}); 
        const user_id = userData._id.valueOf();

        const result= await Cart.updateOne({user_id : user_id, _id: mongoose.Types.ObjectId(id), "cart._id": mongoose.Types.ObjectId(cart_id)},
         { $set: { quantity: quantity }} );
       
        // const result = await Cart.findOne({ user_id: user_id });
        // var data = result.cart

        // var res1 = data.filter((item) => {
        //     parseInt(item._id) === parseInt(product_id)
        // }).map((item)=>{
        //     console.log(item.quantity);
        // })

        return res.status(200).send({ status: "true" })
    }
    catch (err) {
        res.status(500).send({
            message: "Internal server error", status: "false"
        })
    }
})

router.put("/cartQuantity", async (req, res) => {
  let token = req.headers.authorization;
        const token_data = await Token.findOne({"token":token});
        const userData= token_data ? await User.findOne({_id:token_data.user}) : null; 
        const user_id = userData?._id.valueOf();
        const productId = req.body.productId;
        const quantityNum = req.body.quantityNum
        console.log(productId)

        const userdetails = await Cart.findOne({
            user_id: user_id
        });

        if (userdetails) {
          const findCartProduct = await Cart.findOne(
              {"cart._id":productId,"user_id":user_id}
          )
          if(findCartProduct){
            if(quantityNum=="plus"){
              const result = await Cart.updateOne({"cart._id":productId,"user_id":user_id}, { $inc : { "cart.$.cartQuantity": 1 } });
              console.log(result);
              return res.status(200).send({    message: 'Quantity updated successfully',status: true })
            }
            else if(quantityNum=="minus"){
              const result = await Cart.updateOne({"cart._id":productId,"user_id":user_id}, { $inc : { "cart.$.cartQuantity": -1 } });
              console.log(result);
              return res.status(200).send({    message: 'Quantity updated successfully',status: true })
            }
          }
          else{
            return res.status(500).send({    message: 'No cart found',status: true })
          }
        }
        else{
          return res.status(500).send({    message: 'No user found',status: false })
        }
})

router.put("/cartdetails", async (req, res) => {
    try {
        let token = req.headers.authorization;
        const token_data = await Token.findOne({"token":token});
        // const userData=await User.findOne({_id:token_data.user}); 
        // const user_id = userData._id.valueOf();
        const userData= token_data ? await User.findOne({_id:token_data.user}) : null; 
        const user_id = userData?._id.valueOf();
        const products = req.body.products
        console.log(products)

        const userdetails = await Cart.findOne({
            user_id: user_id
        });

        if (userdetails) {

            const findCartProduct = await Cart.findOne(
                {"cart._id":products._id,"user_id":user_id}
            )
    
            if(findCartProduct){
                const result = await Cart.updateOne({"cart._id":products._id,"user_id":user_id}, { $inc : { "cart.$.cartQuantity": 1 } });
                console.log(result);
                return res.status(200).send({    message: 'Cart Added Successfully',status: true })
            }

            else{
            const finalProduct = {...products,...{cartQuantity:1,purchaseStatus:0}}
            const result = await Cart.updateOne({ user_id: user_id }, { $push: { cart: finalProduct } });
            console.log(result);
            return res.status(200).send({    message: 'Cart Added Successfully',status: true })
            }
        }
        else {
            const finalProduct = {...products,...{cartQuantity:1,purchaseStatus:0}}
            const newCart = new Cart({ user_id: mongoose.Types.ObjectId(user_id), cart: finalProduct });
            await newCart.save();
            res.status(200).send({
                message: 'Cart Added Successfully',
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

    const token_data = await Token.findOne({"token":token});
    const userData=await User.findOne({_id:token_data.user}); 
    const user_id = userData._id.valueOf()
    console.log(product_id, user_id)
    try {

        await Cart.updateOne(
            { user_id: user_id },
            { $pull: { cart: { _id: product_id } } },
        );
        res.status(200).send({
            message: 'Cart Item Deleted Successfully',
            status: "true"
        });
    }
    catch (err) {
        res.status(500).send({
            message: "Internal server error",
            status: "false"
        })
    }
});

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
        console.log("santhosh", token);
        let cartObj={};
        const token_data = await Token.findOne({ token });
        if(token_data){
            // const userData = await User.findOne({ _id: token_data.user });
            // const user_id = userData._id.valueOf();
            const userData= token_data ? await User.findOne({_id:token_data.user}) : null; 
            const user_id = userData?._id.valueOf();
            const newCart = await Cart.findOne({ user_id });
            const tempCart = [];
            if(newCart){
                for (const data of newCart._doc.cart) {
                try {
                    if (data.mktOfferFor == "promo" && data.purchaseStatus==0) {
                    const products = await getPromoProducts(data._id,1, newCart._doc.cart.length);
                    const finalProduct = {...products,...{cartQuantity:data.cartQuantity,purchaseStatus:data.purchaseStatus}}
                    tempCart.push(finalProduct);
                    } else if (data.apply == "earnCrop" && data.purchaseStatus==0) {
                    const products = await getEarnCropSingleProductById(data._id);
                    const finalProduct = {...products,...{cartQuantity:data.cartQuantity,purchaseStatus:data.purchaseStatus}}
                    tempCart.push(finalProduct);
                    } else if (data.apply == "redeemCrop" && data.purchaseStatus==0) {
                    const products = await getRedeemCropSingleProductById(data.mktOfferFor, data.sector, 1, newCart._doc.cart.length);
                    const finalProduct = {...products,...{cartQuantity:data.cartQuantity,purchaseStatus:data.purchaseStatus}}
                    tempCart.push(finalProduct);
                    }
                } catch (err) {
                    console.error(err);
                }
                }
                if(tempCart.length<=0){
                res.status(200).send({ data: [], status: "true" });
                }
                else{
                res.status(200).send({ data:{_id:newCart._id,user_id:newCart.user_id,cart: tempCart}, status: "true" });
                }
            }
            else{
                res.status(200).send({message:"No cart found",status:false}) 
            }
        }
        else{
            res.status(500).send({message:"Authorization required",status:false}) 
        }
      }
    catch(err){
        console.log(err);
        res.status(500).send({data:err,status:false})         
    }
});

router.get("/checkCart", async (req,res)=>{
    // db.carts_customers.find({'user_id':ObjectId('6433d23903a970bb517e5d7a'),'cart.apply':'earnCop'})
    let token = req.headers.authorization;
    let sector=req.query.sector;
    const token_data = await Token.findOne({"token":token});
    // const userData=await User.findOne({_id:token_data.user}); 
    // const user_id = userData?._id.valueOf();
    const userData= token_data ? await User.findOne({_id:token_data.user}) : null; 
    const user_id = userData?._id.valueOf();
  
    if(userData){
      const result = await Cart.find({'user_id':mongoose.Types.ObjectId(user_id),'cart.apply':sector});
      const result2 = await Cart.find({'user_id':mongoose.Types.ObjectId(user_id)});
            if(result.length > 0){
                res.status(200).send({status:true})
            }
            else if(result2[0]?._doc.cart.length==0){
                res.status(200).send({status:true})
            }
            else if(result2.length==0){
              res.status(200).send({status:true})
            }
            else{
                res.status(200).send({status:false})
            }
        }
  })

module.exports = router;
