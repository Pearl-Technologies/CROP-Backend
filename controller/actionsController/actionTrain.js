const { getCropNumber, getPaymentRefId, tempChatData, tempSqaureData } = require("./actions/cropUserAction");

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
    },
    CHAT_TEST:{
        GET_SELECT_VAL:(token)=>{
            return tempChatData(token);
        },
        GET_SQUARE_VAL:(token,data)=>{
            return tempSqaureData(token,data);
        },
        GET_FIRM_NAME:(token)=>{
            return ["CROP","TEST"]
        },
        GET_USER_NAME:(token)=>{
            return "TONY"
        },
        GET_COMP_ID:(token,payload,args)=>{
            console.log(payload,args)
            if(args["GET_FIRM_NAME"]=="CROP"){
                return 10916718920;
            }
            else{
                return 92826373272;
            }
        },
        GET_COUNTRY_NAME:(token,payload)=>{
            return [{
                GET_COUNTRY_NAME:"Austraila",
                GET_FIRM_NAME:"CROP",
                GET_STARTED:2021
            },
            {
                GET_COUNTRY_NAME:"Austraila",
                GET_FIRM_NAME:"TEST",
                GET_STARTED:2023
            },
            {
                GET_COUNTRY_NAME:"America",
                GET_FIRM_NAME:"Google",
                GET_STARTED:2020
            },
            {
                GET_COUNTRY_NAME:"Netherlands",
                GET_FIRM_NAME:"Stripe",
                GET_STARTED:2022
            }
            ]
        }
    }
}

const actionDepends={
    GET_SQUARE_VAL:["GET_SELECT_VAL"],
    GET_COUNTRY_NAME:["GET_FIRM_NAME"]
}

module.exports={ actionTrain, actionDepends };