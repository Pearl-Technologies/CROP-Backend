const mongoose=require("mongoose");
const ChatQuestions=require("./../models/chatQuestionModel");
const ChatModal=require("./../models/chatModel");
const { v4:uuid } = require("uuid");
const { actionTrain, actionDepends } = require("./actionsController/actionTrain");
const ref_number = require("../addons/uuIdGen");

function generateRandomString(length) {
    let randomString = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
  
    return randomString;
  }

const getActionDepends = (data)=>{
    try{
        let dependData = Object.keys(actionDepends);
        if(Array.isArray(data)){
            const commonValues = data.filter((value) => dependData.includes(value));

            if(commonValues.length==1){
                return commonValues.toString();
            }
            else if(commonValues.length <= 0){
                return ""
            }
            else{
                throw new Error("Requested data contains two dependents");
            }
        }
        else{
            return ""
        }
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

const chatTrainModel = async (req,res)=>{
    try{
    const { questionText,foreignKey,text,optionRadio : optionRadioArray,optionSelect : optionSelectArray,optInput,optInputName,optSelect,action } = req.body;

    let radioData = optionRadioArray.map((data)=>{
        return({
            actual:data,
            forRespond:mongoose.Types.ObjectId()
        })
    })

   let selectData = optionSelectArray.map((data)=>{
        return({
            actual:data,
            forRespond:mongoose.Types.ObjectId()
        })
    })

    await ChatModal({
        text:text,
        foreignKey:foreignKey,
        optionRadio: radioData,
        optionSelect: selectData,
        optInput: optInput,
        optInputName: optInput,
        optSelect: optSelect,
        action:action
    }).save();
    
    res.status(200).json({
        status:true,
        message:"Data stored"
    });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:false,
            message:err
        });
    }
}

const getTrainedFeedback = async (req,res)=>{
    try{
        const { foreignKey } = req.query;
        let getChats = await ChatModal.find({foreignKey:foreignKey});
        console.log(getChats)
        if(getChats.length<=0){
            res.status(500).json({
                status:false,
                data:[],
                message:"Not yet trained"
            });
        }
        else{
            res.status(200).json({
                status:true,
                data:getChats
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:false,
            message:err
        });
    }
}

const updateChatModel = async (req,res)=>{
    try{
    console.log(req.params.id);
    const { id } = req.params;
    const { optionRadio : optionRadioArray, optionSelect, optInput, optInputName, optSelect : optionSelectArray, action } = req.body;
    // const modifiedOptionRadio = optionRadio.replace(/'/g, '"');
    // const optionRadioArray = JSON.parse(modifiedOptionRadio)

    // const modifiedOptionSelect = optionSelect.replace(/'/g, '"');
    // const optionSelectArray = JSON.parse(modifiedOptionSelect)

    console.log(optionRadioArray,optionSelectArray)

    let radioData = optionRadioArray.map((data)=>{
        return({
            actual:data,
            forRespond:mongoose.Types.ObjectId()
        })
    })

   let selectData = optionSelectArray.map((data)=>{
        return({
            actual:data,
            forRespond:mongoose.Types.ObjectId()
        })
    })

    if(radioData.length == 0 && selectData.length == 0){
        await ChatModal.updateOne(
            { foreignKey: id },
            {
              $set: { optionRadio: [], optionSelect: [] }
            }
          );
    }
    else if (radioData.length === 0) {
        await ChatModal.updateOne(
          { foreignKey: id },
          {
            $set: { optionRadio: [] },
            $push: { optionSelect: { $each: selectData } }
          }
        );
      } else {
        await ChatModal.updateOne(
          { foreignKey: id },
          {
            $set: { optionSelect: [] },
            $push: { optionRadio: { $each: radioData } }
          }
        );
      }

      res.status(200).json({
            status:true,
            message:"Date updated successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:false,
            message:err
        });
    }
}

const feedbackTrainedModel = async (req,res)=>{
    try{
    // console.log(req.body);
    const { id } = req.params;
    const { text, optionRadio : optionRadioArray, optionSelect : optionSelectArray, optInput, optInputName, optSelect, action } = req.body;

    if(!text){
        return res.status(500).json({status:false,message:"Text should not be empty"});
    }

    let radioData = optionRadioArray.map((data)=>{
        if(data && data.forRespond==""){
            return({
                actual:data.actual,
                forRespond:mongoose.Types.ObjectId()
            })   
        }
        else{
            return data
        }
    })

   let selectData = optionSelectArray.map((data)=>{
        if(data && data.forRespond==""){
            return({
                actual:data.actual,
                forRespond:mongoose.Types.ObjectId()
            })   
        }
        else{
            return data
        }
    })

    if(radioData.length == 0 && selectData.length == 0){
        await ChatModal.updateOne(
            { foreignKey: id },
            {
              $set: { optionRadio: [], optionSelect: [],text:text,optInput:optInput, optInputName:optInputName, optSelect:optSelect,action:action }
            }
          );
    }
    else if (radioData.length === 0) {
        await ChatModal.updateOne(
          { foreignKey: id },
          {
            $set: { optionRadio: [],optionSelect:selectData, text:text,optInput:optInput, optInputName:optInputName, optSelect:optSelect,action:action}
          }
        );
      } else {
        await ChatModal.updateOne(
          { foreignKey: id },
          {
            $set: { optionRadio:radioData, optionSelect: [],text:text,optInput:optInput, optInputName:optInputName, optSelect:optSelect,action:action }
          }
        );
      }

      res.status(200).json({
            status:true,
            message:"Date updated successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:false,
            message:err
        });
    }
}

const findForeignKey = async (req,res)=>{
    try{
        const { foreignKey } = req.query;
        let foreignData = await ChatModal.find({
            foreignKey:foreignKey
        }).count();
        if(foreignData<=0){
            res.status(200).json({
                status:false,
                message:"No data found"
            });
        }
        else{
            res.status(200).json({
                status:true,
                message:"Data found"
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:false,
            message:err
        });
    }
}

const updateResponseText = async (req,res)=>{
    try{
        const { id } = req.params;
        const { actual, forRespond, selectType } = req.body;
        
        console.log(id);
        console.log(actual, forRespond, selectType);
        let selectField = selectType=="radio" ? "optionRadio" : selectType=="select" ? "optionSelect" : "";
        let resData = await ChatModal.findOneAndUpdate({foreignKey:id,[`${selectField}.forRespond`]:forRespond},
        {$set:{[`${selectField}.$[num].actual`]:actual}},{arrayFilters:[{"num.forRespond":forRespond}]});

        if(resData){
            res.status(200).json({
                status:true,
                message:"Data successfully updated"
            });
        }
        else{
            res.status(500).json({
                status:false,
                message:"No record updated"
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:false,
            message:err
        });
    }
}

const getFeedbackHistory = async (req,res)=>{
    try{
        const { id }=req.params;
        let response = await ChatModal.find({$or:[{"optionRadio.forRespond":id},
        {"optionSelect.forRespond":id}]})
        // console.log(response[0].foreignKey)
        if(response.length>0){
            res.status(200).json({
                status:true,
                data:[{foreignKey:response[0].foreignKey}],
            });
        }
        else{
            res.status(500).json({
                status:false,
                data:[],
                message:"No data found"
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:false,
            message:err
        });
    }
}

const deleteTrainModel = async (req,res)=>{
   try{
        const { id } = req.params;
        const { forRespond } = req.body;
        let response = await ChatModal.updateMany({foreignKey:id},{$pull:{optionSelect:{forRespond:forRespond},
            optionRadio:{forRespond:forRespond}}})
        let responseDelete = await ChatModal.deleteOne({foreignKey:forRespond})
       
        console.log(response)
        if(response && responseDelete){
            res.status(200).json({
                status:true,
                message:"Data deleted successfully"
            });
        }
        else{
            res.status(500).json({
                status:false,
                message:"No data deleted"
            });
        }
   }
   catch(err){
        console.log(err);
        res.status(500).json({
            status:false,
            message:err
        });
   }
}

const getUserTrainedFeedback = async (req,res)=>{
    try{
    const { foreignKey } = req.body;
    const actionData =  req.actionData;
    
    let getChats = await ChatModal.findOne({foreignKey:foreignKey}).lean();
    if(getChats){
        let messagetext=getChats.text;
        let optionFilter=getChats.optionRadio.length > 0 ? getChats.optionRadio : getChats.optionSelect;
        let filteredData=optionFilter && optionFilter.length > 0 ? optionFilter : {actual:"",forRespond:""};
        const regex = /\$\$(.*?)\$\$/g;
            if(getChats.action.trim()){
                const subActions = [...messagetext.matchAll(regex)].map(data=>data[1]);
                let tempArr=[];
                if(filteredData && filteredData.length > 0){
                const subSelectActions = await Promise.all(
                    filteredData.map(async (datum) => {
                      const text = [...datum.actual.matchAll(regex)].map((data) => data[1]);
                      console.log(text);
                      console.log(getActionDepends(text));

                      if(getActionDepends(text)){
                        async function fetchData(selectedData) {
                            let responseData = await actionTrain[getChats.action][getActionDepends(text)](req.token, selectedData,actionData);
                            console.log(responseData);
                            const replacedData = responseData.map(item => {
                                const replacedString = {
                                    actual:datum.actual.replace(/\$\$(.*?)\$\$/g, (match, matchString) => item[matchString]),
                                    forRespond:datum.forRespond,
                                    _id:datum._id
                                };
                                return replacedString;
                              });
                              return replacedData;
                        }
                        const datatext = await fetchData(text);
                        return datatext;
                      }
                      else if (text.length > 0) {
                        async function fetchData(selectedData) {
                          const result = await Promise.all(
                            selectedData.map(async (data) => {
                              const responseData = await actionTrain[getChats.action][data](req.token, getChats);
                              let updatedDatum = {};
                              if(Array.isArray(responseData) && responseData.length > 0){
                                responseData.forEach((resdata)=>{
                                    if(Array.isArray(resdata) || typeof resdata == "string"){
                                        let finalText = datum.actual.replaceAll(`$$${data}$$`, resdata.toString());
                                        let tempObj={ ...datum, actual: finalText };
                                        tempArr.push(tempObj); 
                                    }
                                    // else{
                                    //     let finalText = datum.actual.replaceAll(`$$${data}$$`, resdata[data]);
                                    //     let tempObj={ ...datum, actual: finalText };
                                    //     tempArr.push(tempObj); 
                                    // }
                                })
                                updatedDatum=tempArr;
                              }
                              else{
                                const finalText = datum.actual.replaceAll(`$$${data}$$`, responseData.toString());
                                updatedDatum = { ...datum, actual: finalText };
                              }
                  
                              return updatedDatum;
                            })
                          );
                          return result;
                        }
                  
                        const datatext = await fetchData(text);
                        return datatext;
                      }
                      else{
                        return datum;
                      }
                    })
                  );
                  
                //   const flattenedOptionSelect = subSelectActions.flatMap((subArray) => subArray.flat());
                const flattenedOptionSelect = subSelectActions.reduce((acc, subArray) => acc.concat(subArray), []);


                  if(getChats.optionRadio && getChats.optionRadio.length > 0){
                    getChats["optionRadio"]=[].concat(...flattenedOptionSelect);
                  }
                  else if(getChats.optionSelect && getChats.optionSelect.length > 0){
                  getChats["optionSelect"]=[].concat(...flattenedOptionSelect);
                  }
                }
                
                if(subActions.length>0){
                    let result = await Promise.all(subActions.map(async (data)=>{
                        let reponseData = {};
                        reponseData[data] = await actionTrain[getChats.action][data](req.token,getChats,actionData)
                        return reponseData;
                    }));

                    result.forEach((datum)=>{
                        Object.keys(datum).map((data)=>{
                        let finalText = messagetext.replaceAll(`$$${data}$$`,datum[data])
                        messagetext=finalText;
                    })
                    })
                    getChats["text"]=messagetext;
                }
            }
            res.status(200).json({
                status:true,
                data:getChats
            });
    }
    else{
        res.status(500).json({
            status:false,
            data:[],
            message:"Not yet trained"
        });
    }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:false,
            message:err
        });
    }
}

const getAdminAction = async (req,res)=>{
    try{
        const subActionsData = {};
        let actionData = [];

        for(const action in actionTrain){
            subActionsData[action] = Object.keys(actionTrain[action]);
        }

        res.status(200).json({
            status:true,
            data:subActionsData
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:false,
            message:err
        });
    }
}

module.exports = { chatTrainModel, getTrainedFeedback, updateChatModel, 
    updateResponseText, feedbackTrainedModel, findForeignKey, getFeedbackHistory, deleteTrainModel, getUserTrainedFeedback, getAdminAction};