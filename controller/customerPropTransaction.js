const customerPropTransaction = require('../models/PropTransaction');
const mongoose = require('mongoose');

const getMyPropTrasaction = async(req, res)=>{
    const {user} =req.query;
     
    try {        
        let findone = await customerPropTransaction.find({user})
        if(!findone.length){
          return res.status(200).send({msg: "no order"})
        }
        const trasactionDetails = await customerPropTransaction.aggregate(
            [
                {
                  '$match': {
                    'user':{$eq: findone[0].user}
                  }
                }, {
                  '$project': {
                    'orderNumber': 1, 
                    'transactionType': 1, 
                    'prop': 1, 
                    'amount': 1, 
                    'description':1,
                    'createdAt':1
                  }
                },
                { $sort: { createdAt: -1 } },
              ]
        )
        res.status(200).send({trasactionDetails})
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"internal server error"})
    }
}
const SaveMyPropTrasaction=async(amount, prop, transactionType, description, orderNumber, user)=>{  
    if(!prop || !transactionType|| !orderNumber || !user ){
        return console.log("all field is required"); 
    }  
    try {
        await customerPropTransaction.create({
            orderNumber,
            transactionType,
            prop,
            description,
            amount,
            user,
        });
        console.log("trasaction created")
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getMyPropTrasaction, SaveMyPropTrasaction };