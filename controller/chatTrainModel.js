const mongoose=require("mongoose");
const ChatQuestions=require("./../models/chatQuestionModel");
const ChatModal=require("./../models/chatModel");
const { v4:uuid } = require("uuid");
const actionTrain = require("./actionsController/actionTrain");
const ref_number = require("../addons/uuIdGen");

const chatTrainModel = async (req,res)=>{
    try{
    const { questionText,foreignKey,text,optionRadio : optionRadioArray,optionSelect : optionSelectArray,optInput,optInputName,optSelect,action } = req.body;
    // console.log(optionRadio);
    // const modifiedOptionRadio = optionRadio.replace(/'/g, '"');
    // const optionRadioArray = JSON.parse(modifiedOptionRadio)

    // const modifiedOptionSelect = optionSelect.replace(/'/g, '"');
    // const optionSelectArray = JSON.parse(modifiedOptionSelect)

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
        if(data.forRespond && data.forRespond==""){
            return({
                actual:data,
                forRespond:mongoose.Types.ObjectId()
            })   
        }
        else{
            return data
        }
    })

   let selectData = optionSelectArray.map((data)=>{
        if(data.forRespond==""){
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
    const { foreignKey } = req.query;
    let getChats = await ChatModal.findOne({foreignKey:foreignKey});
    if(getChats){
        let messagetext=getChats.text;
        let optionSelect=getChats.optionSelect.length > 0 ? getChats.optionSelect[0] : {actual:"",forRespond:""};
        const regex = /\$\$(.*?)\$\$/g;
            if(getChats.action.trim()){
                const subActions = [...messagetext.matchAll(regex)].map(data=>data[1]);
                const subSelectActions = [...optionSelect.actual.matchAll(regex)].map(data=>data[1]);
                if(subActions.length>0){
                    let result = await Promise.all(subActions.map(async (data)=>{
                        let reponseData = {};
                        reponseData[data] = await actionTrain[getChats.action][data](req.token,getChats)
                        return reponseData;
                    }));

                    result.forEach((datum)=>{
                        Object.keys(datum).map((data)=>{
                        let finalText = messagetext.replaceAll(`$$${data}$$`,datum[data])
                        messagetext=finalText;
                    })
                    })
                    console.log(messagetext);
                    getChats["text"]=messagetext;
                }
                else if(subSelectActions.length>0 && getChats.optSelect){
                    let result = await Promise.all(subSelectActions.map(async (data)=>{
                        let reponseData = await actionTrain[getChats.action][data](req.token,getChats)
                        return reponseData;
                    }));
                    if(result.length>0){
                        getChats["optionSelect"]=result[0]
                    }

                    // result.forEach((datum)=>{
                    //     Object.keys(datum).map((data)=>{
                    //         let finalText = messagetext.replaceAll(`$$${data}$$`,datum[data])
                    //         messagetext=finalText;
                    //     })
                    // })
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