const express = require('express')
const router = express.Router();
const {Token} = require("../models/User");


router.get("/token",async (req,res)=>{
    const token=req.headers.authorization;
    const token_data = await Token.findOne({"token":token});

    if(token_data){
        res.status(200).send({"status":true})
    }
    else{
        res.status(200).send({"status":false})
    }
})

module.exports = router;