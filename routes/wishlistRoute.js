const express= require('express')
const router = express.Router();
const {Wishlist} = require("../models/Wishlist")
const {Product} = require("../models/Product")
const {User} = require("../models/User");
const mongoose = require('mongoose');


router.put("/cartdetails",async(req,res) => {
    try {
        let token=req.headers.authorization;
        const userData=await User.findOne({"token":token}); 
        const user_id=userData._id.valueOf();
        const products=req.body.products
        console.log(products)

        const userdetails=await Wishlist.findOne({
            user_id:user_id
         });  

         if(userdetails)  
         {
            const result= await Wishlist.updateOne({user_id : user_id }, { $push: { Wishlist: products } });     
            console.log(result);  
            return res.status(200).send({status:true})
         }
         else
         {
            const newCart = new Wishlist({user_id: mongoose.Types.ObjectId(user_id),Wishlist:products});
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
    const user_id=userData._id.valueOf()
  
    try 
    {
         await Wishlist.updateOne(
            {user_id: user_id },
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
    const user_id=userData._id.valueOf();
     console.log(user_id)

        const newCart = await Wishlist.findOne({user_id:user_id});
        res.status(200).send({data:newCart.Wishlist,status:"true"})         
       
});

module.exports = router;
  