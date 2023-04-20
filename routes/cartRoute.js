const express = require('express')
const router = express.Router();
const { Cart } = require("../models/Cart")
const { Product } = require("../models/businessModel/product")
const { User } = require("../models/User");
const {Token} = require("../models/User");
const mongoose = require('mongoose');

router.put("/quantity", async (req, res) => {

    try {
        let quantity = req.body.quantity;
        let token = req.headers.authorization;
        const token_data = await Token.findOne({"token":token});
        const userData=await User.findOne({_id:token_data.user}); 
        const user_id = userData._id.valueOf();
        const product_id = req.body.product_id;

        const result= await Cart.updateOne({user_id : user_id }, { $set: { cart: {_id:{ quantity: quantity }} }});
       
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

router.put("/cartdetails", async (req, res) => {
    try {
        let token = req.headers.authorization;
        const token_data = await Token.findOne({"token":token});
        const userData=await User.findOne({_id:token_data.user}); 
        const user_id = userData._id.valueOf();
        const products = req.body.products
        console.log(products)

        const userdetails = await Cart.findOne({
            user_id: user_id
        });

        if (userdetails) {
            const result = await Cart.updateOne({ user_id: user_id }, { $push: { cart: products } });
            console.log(result);
            return res.status(200).send({ status: true })
        }
        else {
            const newCart = new Cart({ user_id: mongoose.Types.ObjectId(user_id), cart: products });
            await newCart.save();
            res.status(200).send({
                message: 'Cart Added Successfully',
                status: "true",

            });
        }
    }
    catch (err) {
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
    try{
        let token = req.headers.authorization;
        console.log("santhosh", token)
        const token_data = await Token.findOne({"token":token});
        const userData=await User.findOne({_id:token_data.user}); 
        const user_id = userData._id.valueOf();
        const newCart = await Cart.findOne({ user_id: user_id });
        console.log(newCart);
        if(newCart == null){
            res.status(200).send({ data: [], status: "true" })
        }else{
            res.status(200).send({ data: newCart.cart, status: "true" })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({data:err,status:false})         
    }
});

module.exports = router;
