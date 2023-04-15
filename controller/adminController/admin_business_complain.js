const adminBusinessComplain = require("../../models/admin/admin_business_complain");

const createBusinessComplain = async (req, res) => {
  try {
    const {description, expectedOutcoms, complainType, preferredMediumContact, complainNumber, user} = req.body;
    const findone = await adminBusinessComplain.find({complainNumber});
    if (findone.length) {
      return res.status("400").send("one record is already exist");
    }
    await adminBusinessComplain.create({
      description,
      expectedOutcoms,
      complainType,
      preferredMediumContact,
      complainNumber,
      user
    });
    res.json({ success: true, message: "created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
  }
};
const getBusinessComplain = async (req, res) => {
  try {
    const getComplainList = await adminBusinessComplain.find({});
    res.status(200).json({ getComplainList });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({msg:"Some Error Occured"});
  }
};
const updateBusinessComplain = async (req, res) => {
const {_id, complainStatus, complainResponse } = req.body;

  try {
    let newData = {};
    newData.complainUpdateDate = Date.now()
    if(complainStatus){
      newData.complainStatus = complainStatus;
    }
    if(complainResponse){
      newData.complainResponse = complainResponse;
    }

    const findComplain = await adminBusinessComplain.findOne({_id})
    if(!findComplain){
      return res.status(204).json({msg:"sorry no record found"})
    }
    await adminBusinessComplain.findByIdAndUpdate({_id}, {$set:newData}, {new:true});
    res.status(202).json({ msg:"updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({msg:"Some Error Occured"});
  }
};
module.exports = { createBusinessComplain, getBusinessComplain, updateBusinessComplain };
