const { getCropNumber, getPaymentRefId } = require("./actions/cropUserAction");

const actionTrain = {
    CROP_USER_ACTION:{
        GET_CROP_NUM:(token,chats)=>{
            return getCropNumber(token,chats);
        },
        GET_PAYMENT_REF_NUM:(token,chats)=>{
            return getPaymentRefId(token,chats);
        }
    },
    REF_USER_ACTION:{
        GET_CROP_NUM:(token)=>{
            return getCropNumber(token);
        },
        GET_REF_NUM:(token)=>{
            return getCropNumber(token);
        }
    }
}

module.exports=actionTrain;