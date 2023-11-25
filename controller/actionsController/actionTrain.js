const {
    getCropNumber,
    getPaymentRefId,
    tempChatData,
    tempSqaureData,
    fetchOrderNumber,
    checkValidCropCredit,
    RaiseTicket,
  } = require("./actions/cropUserAction");
  
    // sample data 

  const actionTrain = {
    CROP_USER_ACTION: {
      GET_CROP_NUM: (token, chats) => {
        return getCropNumber(token, chats);
      },
      GET_PAYMENT_REF_NUM: (token, chats) => {
        return getPaymentRefId(token, chats);
      },
      GET_ORDER_NUM: (token, payload, args) => {
        return fetchOrderNumber(token, payload, args);
      },
      CHECK_VALID_CROP_CREDIT: (token, payload, args) => {
        return checkValidCropCredit(token, payload, args);
      },
      TICKET_CROP: async (token, payload, args) => {
        let data = {
          issueData: args,
          actionText: payload.action,
          actionId: payload.foreignKey,
          issueText: "CROP LOGIN",
        };
        let dataObj = await RaiseTicket(token, data);
        return dataObj;
      },
    },
    REF_USER_ACTION: {
      GET_CROP_NUM: (token) => {
        return getCropNumber(token);
      },
      GET_REF_NUM: (token) => {
        return getCropNumber(token);
      },
    },
    CHAT_TEST: {
      GET_SELECT_VAL: (token) => {
        return tempChatData(token);
      },
      GET_SQUARE_VAL: (token, data) => {
        return tempSqaureData(token, data);
      },
      GET_FIRM_NAME: (token) => {
        return ["CROP", "TEST"];
      },
      GET_USER_NAME: (token) => {
        return "TONY";
      },
      GET_COMP_ID: (token, payload, args) => {
        console.log(payload, args);
        if (args["GET_FIRM_NAME"] == "CROP") {
          return 10916718920;
        } else {
          return 92826373272;
        }
      },
      GET_COUNTRY_NAME: (token, payload) => {
        return [
          {
            GET_COUNTRY_NAME: "Austraila",
            GET_FIRM_NAME: "CROP",
            GET_STARTED: 2021,
          },
          {
            GET_COUNTRY_NAME: "Austraila",
            GET_FIRM_NAME: "TEST",
            GET_STARTED: 2023,
          },
          {
            GET_COUNTRY_NAME: "America",
            GET_FIRM_NAME: "Google",
            GET_STARTED: 2020,
          },
          {
            GET_COUNTRY_NAME: "Netherlands",
            GET_FIRM_NAME: "Stripe",
            GET_STARTED: 2022,
          },
        ];
      },
      GET_TEST_ID: (token, payload, args) => {
        return ["First_Id", "Second_Id"];
      },
      GET_TEST_NAME: (token, payload, args) => {
        if (args["GET_TEST_ID"] == "First_Id") {
          return [
            {
              GET_TEST_NAME: "Test001",
            },
            {
              GET_TEST_NAME: "Test002",
            },
          ];
        } else {
          return [
            {
              GET_TEST_NAME: "Test003",
            },
            {
              GET_TEST_NAME: "Test004",
            },
          ];
        }
      },
      GET_CHAT_TITLE: (token, payload, args) => {
        return "Test";
      },
      GET_ID: (token, payload, args) => {
        return "Test";
      },
      GET_NOTIFY: (token, payload, args)=>{
        return "Hello"
      },
      GET_TEMP_ID: (token, payload, args)=>{
        return ["Test","Test1"]
      },
      CROP_USER_ID:(token,payload,args)=>{
        console.log(args)
        if(args["GET_TEMP_ID"]=="Test"){
            return [{
                CROP_USER_ID:"TestId001"
            }]
        }
        else{
            return [{
                CROP_USER_ID:"TestId002"
            }]
        }
      }
    },
  };
  
  const actionDepends = {
    GET_SQUARE_VAL: ["GET_SELECT_VAL"],
    GET_COUNTRY_NAME: ["GET_FIRM_NAME"],
    GET_ORDER_NUM: ["GET_ORDER_NUM", "GET_PRODUCT_NAME"],
    GET_TEST_NAME: ["GET_TEST_ID"],
    CROP_USER_ID: ["GET_TEMP_ID"]
  };
  
  module.exports = { actionTrain, actionDepends };