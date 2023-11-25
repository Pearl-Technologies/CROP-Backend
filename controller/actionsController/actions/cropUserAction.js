const mongoose = require("mongoose");
const { Token, User } = require("../../../models/User")
const { customerPaymentTracker } = require("../../../models/admin/PaymentTracker/paymentIdTracker");
const Tickets = require("../../../models/Tickets");
const CropTransaction = require("../../../models/CropTransaction");

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

const tempChatData = (token)=>{
    return ["Hi","Hello","Man","What","Are","You","Doing"]
}

const tempSqaureData = (token,data)=>{
    let dependData = data(token);
    let finalData = dependData.filter((datum)=>{
        if(datum=="Hi"){
            return [datum,"Hi and Hello"]
        }
        else{
            return [datum,datum]
        }
    })
    return finalData;
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

const checkValidCropCredit=async (token,payload,args)=>{
    try{
        let response = await Token.findOne({token:token});
        if(response){
            let user = await User.findOne({_id:response.user});
            if(user){
                let checkTransaction=await CropTransaction.findOne({
                    orderNumber:args["GET_ORDER_NUM"]
                });
                if(checkTransaction){
                    return true;
                }
                else{
                   let findTransaction=await CropTransaction.aggregate([
                        {$match: {
                          payment_intent:args["GET_ORDER_NUM"],
                          status:"paid",
                        }},
                        {
                          $addFields: {
                            crops: {
                              $cond:{
                                if:{$gt:[{$ifNull:["$cartDetails.cartItems.cropRulesWithBonus",0]},0]},
                                then:{$sum:"$cartDetails.cartItems.cropRulesWithBonus"},
                                else:{$sum:"$cartDetails.cartItems.ruleAppliedCrops"}
                                          }
                            },
                            amount:{
                              $reduce:{
                                input : "$cartDetails.cartItems",
                                initialValue : 0,
                                in:{
                                 $add: ["$$value","$$this.price"] 
                                }
                              }
                            }
                          }
                        }
                      ]);
                    
                    if(findTransaction.amount > 0){
                        await CropTransaction({
                            orderNumber:args["GET_ORDER_NUM"],
                            transactionType:"credit",
                            crop:findTransaction.crops,
                            amount:findTransaction.amount,
                            user:user,
                            expired:false,
                            usedCrop:0
                        }).save();

                        await User.updateOne({_id:user._id},{
                            $inc:{
                                croppoints:findTransaction.crops
                            }
                        })

                        await Tickets({
                            user:user,
                            issueData:args,
                            action:payload.action,
                            actionId:payload.foreignKey,
                            issueText:"CROP CREDIT - ORDER OR PURCHASE",
                            issueId:mongoose.Types.ObjectId()
                        }).save();
                    }
                }
            }
        }
    }
    catch(err){

    }
}

const fetchOrderNumber=async (token,args)=>{
    try{
        let response = await Token.findOne({token:token});
        if(response){
            let user = await User.findOne({_id:response.user});
            if(user){
                let fetchData = await customerPaymentTracker.aggregate([
                    {$match:{"cartDetails.user_id":mongoose.Types.ObjectId(user._id),status:"paid"}},
                    {$unwind:"$cartDetails.cartItems"},
                    {$addFields:{UserId:"$cartDetails.user_id",ReferenceNo:"$payment_intent",productName:"$cartDetails.cartItems.title",createdAt:"$createdAt"}},
                    {$project:{productName:1,UserId:1,ReferenceNo:1,createdAt:1}}
                    ])
                let resultData=fetchData.map((data)=>{
                    return({
                        GET_ORDER_NUM:data.ReferenceNo,
                        GET_PRODUCT_NAME:data.productName
                    })
                })
                return resultData;
            }
            else{
                throw new Error("Id not found");
            }
        }
    }
    catch(err){

    }
}

const RaiseTicket=async (token,args)=>{
    let response = await Token.findOne({token:token});
    if(response){
    let user = await User.findOne({_id:response.user});
    if(user){
        let data=await Tickets({
            user:user,
            issueData:args.issueData,
            action:args.actionText,
            actionId:args.actionId,
            issueText:args.issueText,
            issueId:mongoose.Types.ObjectId()
        }).save();

        return data.issueId;
    }
    else{
        throw new Error("Id not found");
    }
    }
    else{
        throw new Error("Unauthorized user");
    }
}

module.exports={ getCropNumber, getPaymentRefId, tempChatData, fetchOrderNumber, 
    checkValidCropCredit, tempSqaureData, RaiseTicket };