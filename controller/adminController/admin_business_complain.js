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
    res.json({ success: true, getComplainList });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
const updateBusinessComplain = async (req, res) => {
const {_id, description, expectedOutcoms, complainType, preferredMediumContact, complainNumber } = req.body();
  try {
    let newData = {};
    if(description){
      newData.description = description;
    }
    if(expectedOutcoms){
      newData.expectedOutcoms = expectedOutcoms;
    }
    if(complainType){
      newData.complainType = complainType;
    }
    if(preferredMediumContact){
      newData.preferredMediumContact = preferredMediumContact;
    }
    if(complainNumber){
      newData.complainNumber = complainNumber;
    }
    const findComplain = await adminBusinessComplain.findOne({_id})
    if(!findComplain.length){
      return res.status('400').send("sorry no record found")
    }
    const updateComplain = await adminBusinessComplain.findByIdAndUpdate({_id}, {$set:newData}, {new:true});
    res.json({ success: true, message:"updated" });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
module.exports = { createBusinessComplain, getBusinessComplain, updateBusinessComplain };
