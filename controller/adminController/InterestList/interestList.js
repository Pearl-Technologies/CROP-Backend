const interestList = require("../../../models/admin/interest/InterestProgram");
const {User} = require('../../../models/User');
const admin = require('../../../models/superAdminModel/user');
const business =require('../../../models/businessModel/business') 
const addInterestName = async (req, res) => {
  let user_id = req.user.user.id;
  let { interest_name } = req.body;
  try {
    let findADocument = await interestList.findOne({interestName: interest_name});
    if(findADocument){
        return res.status(404).send({"msg": "interest already exist"})
    }
    let newRecord = await interestList.create({
        interestName: interest_name,
      user: user_id,
    });

    res.status(200).send({"msg":`${newRecord.interestName} interest added successfully`})
  } catch (error) {
    return res.status(500).send({"msg": "internal error"})
  }
};
const getInterestList = async (req, res) => {
    let user_id = req.user.user.id;
    try {
      let findUser = await User.findOne({_id:user_id}) || await admin.findOne({_id:user_id}) || await business.findOne({_id:user_id})  
      if(!findUser){
        return res.status(404).send({"msg":"you are not authorize"})
      }
      let interests = await interestList.find({}, {interestName:1})

      return res.status(200).json({interests});
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg:"Internal Error"})
    }
  };
  const updateInterest = async (req, res) => {
    let user_id = req.user.user.id;
    let {id, interest_name} = req.body;
    try {
      let findUser = await admin.findOne({_id:user_id})  
      if(!findUser){
        return res.status(401).send({"msg":"you are not authorize"})
      }
      let findInterestName = await interestList.findOne({interestName:interest_name})  
      if(findInterestName){
        return res.status(409).send({"msg":"loyalty name already exist please try some thing new"})
      }
      let updateRecord = await interestList.findByIdAndUpdate({_id:id}, {$set:{interestName:interest_name}})
      res.status(200).send({"msg":`${updateRecord.interestName} interest is updated`});
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg:"Internal Error"})
    }
  };
  const deleteInterest = async (req, res) => {
    let user_id = req.user.user.id;
    let {id} = req.body;
    try {
      let findUser = await admin.findOne({_id:user_id})  
      if(!findUser){
        return res.status(401).send({"msg":"you are not authorize"})
      }
      let deleteItem = await interestList.findByIdAndDelete({_id:id})
      res.status(200).send({"msg":`${deleteItem.interestName} interest deleted successfully`});
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg:"Internal Error"})
    }
  };
module.exports = { addInterestName, getInterestList, updateInterest, deleteInterest };
