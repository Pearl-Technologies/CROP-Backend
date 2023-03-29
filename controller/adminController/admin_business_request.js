const adminBusinessRequest = require("../../model/admin/admin_business_request");

const createBusinessRequest = async (req, res) => {
  try {
    const {description, expectedOutcoms, requestType, preferredMediumContact, requestNumber, user} = req.body;
    const findone = await adminBusinessRequest.find({requestNumber});
    if (findone.length) {
      return res.status("400").send("one record is already exist");
    }
    await adminBusinessRequest.create({
      description,
      expectedOutcoms,
      requestType,
      preferredMediumContact,
      requestNumber,
      user
    });
    res.json({ success: true, message: "updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
  }
};
const getBusinessRequest = async (req, res) => {
  try {
    const getRequestList = await adminBusinessRequest.find({});
    res.json({ success: true, getRequestList });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
const updateBusinessRequest = async (req, res) => {
const {_id, description, expectedOutcoms, requestType, preferredMediumContact, requestNumber } = req.body();
  try {
    let newData = {};
    if(description){
      newData.description = description;
    }
    if(expectedOutcoms){
      newData.expectedOutcoms = expectedOutcoms;
    }
    if(requestType){
      newData.requestType = requestType;
    }
    if(preferredMediumContact){
      newData.preferredMediumContact = preferredMediumContact;
    }
    if(requestNumber){
      newData.requestNumber = requestNumber;
    }
    const findComplain = await adminBusinessRequest.findOne({_id})
    if(!findComplain.length){
      return res.status('400').send("sorry no record found")
    }
    const updateRequest = await adminBusinessRequest.findByIdAndUpdate({_id}, {$set:newData}, {new:true});
    res.json({ success: true, message:"updated" });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
module.exports = { createBusinessRequest, getBusinessRequest, updateBusinessRequest };
