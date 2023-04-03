const express= require('express')
const router = express.Router();
const {Wishlist} = require("../models/Wishlist")
const {Product} = require("../models/businessModel/product")
const {User} = require("../models/User");
const mongoose = require('mongoose');

router.put("/cartdetails",async(req,res) => {
    try 
    {
        let token=req.headers.authorization;

        const userData=await User.findOne({"token":token}); 
        const user=userData._id.valueOf();
        const products=req.body.products

        const userdetails=await Wishlist.findOne({
            user_id:user
         });  

         if(userdetails)  
         {
            const result= await Wishlist.updateOne({user_id : user }, { $push: { Wishlist: products } });     
            return res.status(200).send({status:true})
         }
         else
         {
            const newCart = new Wishlist({user_id: mongoose.Types.ObjectId(user),Wishlist:products});
            await newCart.save();
            res.status(200).send({
            message:'Wishlist Added Successfully',
            status:"true"
        });             
       }         
    }
    catch(err) {
        res.status(500).send({
            message:"Internal server error", status:"false"
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

router.put("/deleteCart",async(req,res) => {

    const product_id=req.body.product_id;
    let token=req.headers.authorization;

    const userData=await User.findOne({"token":token}); 
    const user=userData._id.valueOf();
    
    try 
    {
         await Wishlist.updateOne(
            {user_id: user },
            { $pull: { Wishlist: { _id: product_id } } },
          );
        res.status(200).send({
        message:' Item Deleted Successfully',
        status:"true"
        });              
    }
    catch(err) 
    {
        res.status(500).send({
            message:"Internal server error",
            status:"false"
        })
    }
});

router.get("/getCart",async(req,res) => {

    let token=req.headers.authorization;
    const userData=await User.findOne({"token":token}); 
    const user=userData._id.valueOf();
    const newCart = await Wishlist.findOne({user_id:user});
    console.log(newCart)
    res.status(200).send({data:newCart.Wishlist,status:"true"})         
       
});

module.exports = router;
  