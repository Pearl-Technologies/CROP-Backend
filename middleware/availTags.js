const mongoose=require("mongoose");
const ChatModal=require("./../models/chatModel");

const availTags = async (req,res,next)=>{
    try{
        const { actionText, foreignKey } = req.body;
        const chatData = await ChatModal.findOne({
            $or: [
              { "optionSelect.forRespond": foreignKey },
              { "optionRadio.forRespond": foreignKey },
            ]
          }, {
            optionSelect: 1,
            optionRadio: 1,
            action: 1,
          }).lean();          
          console.log(chatData)
          chatData.optionRadio=chatData.optionRadio.find((data)=>{
            if(data.forRespond==foreignKey){
                return data;
            }
          });

          chatData.optionSelect=chatData.optionSelect.find((data)=>{
            if(data.forRespond==foreignKey){
                return data;
            }
          });

            if(chatData.optionRadio || chatData.optionSelect){
                let reqestedText = actionText;
                let tagText = chatData.optionRadio  ? chatData.optionRadio.actual : chatData.optionSelect.actual;

                // Define a regular expression pattern to match the placeholder pattern $$...$$
                const regex = /\$\$(.*?)\$\$/;

                if(tagText.match(regex) && tagText.match(regex).length > 0){

                    let data = tagText.split(" ");
                    let compareData = reqestedText.split(" ");

                    let resultData = {};

                    data.forEach((datum, index) => {
                    if (datum.match(regex)) {
                        let findVal = datum.match(regex)[1];
                        resultData[findVal]=compareData[index]
                    }
                    });
                    req.actionData=resultData;
                }
                else{
                    req.actionData=false;
                }
            }
    }
    catch(err){
        console.log(err)
        req.actionData=false;
    }
    next();
}

const checkAvailTags=(req,res,next)=>{

}

module.exports={ availTags, checkAvailTags };