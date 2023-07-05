const mongoose = require("mongoose");
const { Token, User } = require("../../../models/User")
const { customerPaymentTracker } = require("../../../models/admin/PaymentTracker/paymentIdTracker");

const getCropNumber = async (token,chats)=>{
    try{
        let response = await Token.findOne({token:token});
        if(response){
        let findCropId = await User.findOne({_id:response.user});
        if(findCropId){
            return findCropId.cropid
        }
        else{
            throw new Error("Id not found");
        }
        }
        else{
            throw new Error("Unauthorized user");
        }
    }
    catch(err){
        throw err;
    }
}

const getPaymentRefId = async (token,chats)=>{
    try{
        let response = await Token.findOne({token:token});
        if(response){
        let findCropId = await User.findOne({_id:response.user});
        if(findCropId){
           let fetchData = await customerPaymentTracker.aggregate([
                {$match:{"cartDetails.user_id":mongoose.Types.ObjectId(findCropId._id),status:"paid"}},
                {$unwind:"$cartDetails.cartItems"},
                {$addFields:{UserId:"$cartDetails.user_id",ReferenceNo:"$payment_intent",productName:"$cartDetails.cartItems.title",createdAt:"$createdAt"}},
                {$project:{productName:1,UserId:1,ReferenceNo:1,createdAt:1}}
                ])
            if(fetchData.length>0){
                let refProduct = fetchData.map((data)=>{
                    return({
                        actual:`${data.ReferenceNo} - ${data.productName} -${new Date(data.createdAt).toLocaleDateString()}`,
                        forRespond:chats.optionSelect[0].forRespond,
                        returnActionVal:true,
                        actionText:JSON.stringify(data)
                    })
                })
                return refProduct;
            }
            else{
                return [];
            }
        }
        else{
            throw new Error("Id not found");
        }
        }
        else{
            throw new Error("Unauthorized user");
        }
    }
    catch(err){
        throw err;
    }
}

module.exports={ getCropNumber, getPaymentRefId };