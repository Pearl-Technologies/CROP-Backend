const customerCropTransaction = require('../models/CropTransaction');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getMyCropTrasaction = async(req, res)=>{
    const {user} =req.body; 
    try {
        let findone = await customerCropTransaction.find({user})
        console.log(findone[0]._id);
        const trasactionDetails = await customerCropTransaction.aggregate(
            [
                {
                  '$match': {
                    '_id':{$eq: findone[0]._id}
                  }
                }, {
                  '$lookup': {
                    'from': 'customer_payment_trackers', 
                    'localField': 'payment_intent', 
                    'foreignField': 'orderNumber', 
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
const SaveMyCropTrasaction=async(amount, crop, transactionType, orderNumber, user)=>{  
    if(!amount || !crop || !transactionType|| !orderNumber || !user ){
        return console.log("all field is required"); 
    }  
    try {
        await customerCropTransaction.create({
            orderNumber,
            transactionType,
            crop,
            amount,
            user,
        });
        console.log("trasaction created")
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getMyCropTrasaction, SaveMyCropTrasaction };