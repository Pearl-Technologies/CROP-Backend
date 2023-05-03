const customerCropTransaction = require('../models/CropTransaction');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getMyCropTrasaction = async(req, res)=>{
    const {user} = req.query; 
    let findone = await customerCropTransaction.find({user})
    try {
        let findone = await customerCropTransaction.find({user})
        if(!findone.length){
          return res.status(200).send({msg: "no order"})
        }
        const trasactionDetails = await customerCropTransaction.aggregate(
            [
                {
                  '$match': {
                    'user':{$eq: findone[0].user}
                  }
                }, {
                  '$lookup': {
                    'from': 'customer_payment_trackers', 
                    'localField': 'orderNumber', 
                    'foreignField': 'payment_intent', 
                    'as': 'pt'
                  }
                }, {
                  '$unwind': '$pt'
                }, {
                  '$project': {
                    'orderNumber': 1, 
                    'transactionType': 1, 
                    'crop': 1, 
                    'amount': 1, 
                    'description':1,
                    'pt': {
                      'invoice_url': 1, 
                      'invoice_pdf': 1
                    }
                  }
                }
              ]
        )
        res.status(200).send({trasactionDetails})
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"internal server error"})
    }
}
const SaveMyCropTrasaction=async(amount, crop, transactionType, description, orderNumber, user)=>{  
    if(!amount || !crop || !transactionType|| !orderNumber || !user ){
        return console.log("all field is required"); 
    }  
    try {
        await customerCropTransaction.create({
            orderNumber,
            transactionType,
            crop,
            description,
            amount,
            user,
        });
        console.log("trasaction created")
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getMyCropTrasaction, SaveMyCropTrasaction };