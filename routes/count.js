const express = require('express')
const { Cart } = require("../models/Cart")
const router = express.Router();
const { Product } = require("../models/businessModel/product")
const { User } = require("../models/User");
const {Token} = require("../models/User");
const {Wishlist} = require("../models/Wishlist")
const mongoose = require('mongoose');

router.get("/count",async (req,res)=>{
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
            const newCart = await Cart.find({ "user_id":user_id});
            const wishCart = await Wishlist.find({"user_id":user_id});
            const tempCart = [];
            if(newCart){
                res.status(200).send({count:{
                    cart:newCart[0]?._doc?.cart ? newCart[0]?._doc?.cart.length : 0,
                    wishlist:wishCart[0]?._doc?.Wishlist ? wishCart[0]?._doc?.Wishlist.length : 0 
                },status:true}) 
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
})

module.exports = router;

