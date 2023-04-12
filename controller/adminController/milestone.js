const adminMilestone = require("../../models/admin/admin_milestone");

const createMilestoneData = async (req, res) => {
  try {
    const { first, second, third, fourth, user } = req.body;
    const findone = await adminMilestone.find({});
    if(findone.length){
        return res.status('401').json({msg:"one record is already exist"})
    }
    await adminMilestone.create({
      first,
      second,
      third,
      fourth,
      user
    });
    res.json({ msg: "updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({msg:"Server Problem, please try again after some time"});
  }
};
const getMilestoneData = async (req, res) => {
  try {
    const milestoneReport = await adminMilestone.find({});
    res.status(200).json({ milestoneReport });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({msg:"Server Problem, please try again after some time"});
  }
};
const updateMilestoneData = async (req, res) => {
  try {
    const { first, second, third, fourth, user, _id } = req.body;
    const findRecord = await adminMilestone.findOne({_id});
    if(!findRecord){
        return res.status(204).json({msg: "no record found"});
    }
    let newData={};
    if(first){
      newData.first = first;
    }
    if(second){
      newData.second = second;
    }
    if(third){
      newData.third = third;
    }
    if(fourth){
      newData.fourth = fourth;
    }
    if(findRecord.user.toString() !== user){
      return res.status(401).json({msg: "you are not authorise"})
    }
    await adminMilestone.findByIdAndUpdate({_id}, {$set:newData}, {new:true});
    res.status(202).json({ msg: "updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({msg: "Server Problem, please try again after some time"});
  }
};
module.exports = { createMilestoneData, getMilestoneData, updateMilestoneData };
