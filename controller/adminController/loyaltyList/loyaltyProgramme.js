const loyalityProgrammeList = require("../../../models/admin/loyaltyProgramme/listOfProgram");
const {User} = require('../../../models/User');
const admin = require('../../../models/superAdminModel/user');
const business =require('../../../models/businessModel/business') 
const { IdGenerator } = require("custom-random-id");
const ID = new IdGenerator("{{ number_5 }}");
let id = ID.getFinalExpression();
const addLoyaltyProgramme = async (req, res) => {
  let user_id = req.user.user.id;
  let { program_name } = req.body;
  try {
    let findADocument = await loyalityProgrammeList.findOne({programmeName: program_name});
    if(findADocument){
        return res.status(404).send({"msg": "loyalty already exist"})
    }
    let newRecord = await loyalityProgrammeList.create({
      programmeName: program_name,
      user: user_id,
    });
    console.log(newRecord);
    res.status(200).send({"msg":`${newRecord.programmeName} loyalty programme added`})
  } catch (error) {
    return res.status(500).send({"msg": "internal error"})
  }
};
const getLoyaltyProgramme = async (req, res) => {
    let user_id = req.user.user.id;
    try {
      let findUser = await User.findOne({_id:user_id}) || await admin.findOne({_id:user_id}) || await business.findOne({_id:user_id})  
      if(!findUser){
        return res.status(404).send({"msg":"you are not authorize"})
      }
      let programmes = await loyalityProgrammeList.find({}, {programmeName:1})

      return res.status(200).json({programmes});
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg:"Internal Error"})
    }
  };
  const updateLoyaltyProgramme = async (req, res) => {
    let user_id = req.user.user.id;
    let {id, programme_name} = req.body;
    try {
      let findUser = await admin.findOne({_id:user_id})  
      if(!findUser){
        return res.status(404).send({"msg":"you are not authorize"})
      }
      let findLoyaltyProgram = await loyalityProgrammeList.findOne({programmeName:programme_name})  
      if(findLoyaltyProgram){
        return res.status(409).send({"msg":"loyalty name already exist please try some thing new"})
      }
      let updateRecord = await loyalityProgrammeList.findByIdAndUpdate({_id:id}, {$set:{programmeName:programme_name}})
      res.status(200).send({"msg":`${updateRecord.programmeName} Loyalty is updated`});
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg:"Internal Error"})
    }
  };
  const deleteLoyaltyProgramme = async (req, res) => {
    let user_id = req.user.user.id;
    let {id} = req.body;
    try {
      let findUser = await admin.findOne({_id:user_id})  
      if(!findUser){
        return res.status(401).send({"msg":"you are not authorize"})
      }
      let deleteItem = await loyalityProgrammeList.findByIdAndDelete({_id:id})
      console.log(deleteItem);
      res.status(200).send({"msg":`${deleteItem.programmeName} loyalty deleted successfully`});
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg:"Internal Error"})
    }
  };
module.exports = { addLoyaltyProgramme, getLoyaltyProgramme, updateLoyaltyProgramme, deleteLoyaltyProgramme };
