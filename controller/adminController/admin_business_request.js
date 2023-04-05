const adminBusinessRequest = require("../../models/admin/admin_business_request");

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
const {_id, requestStatus, requestResponse } = req.body;
  try {
    let newData = {};
    newData.requestUpdateDate = Date.now()
    if(requestStatus){
      newData.requestStatus = requestStatus;
    }
    if(requestResponse){
      newData.requestResponse = requestResponse;
    }
    const findComplain = await adminBusinessRequest.findOne({_id})
    if(!findComplain){
      return res.status('400').send("sorry no record found")
    }
    await adminBusinessRequest.findByIdAndUpdate({_id}, {$set:newData}, {new:true});
    res.json({ success: true, message:"updated" });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
module.exports = { createBusinessRequest, getBusinessRequest, updateBusinessRequest };
