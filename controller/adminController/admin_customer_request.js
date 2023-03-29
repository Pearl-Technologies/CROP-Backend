const adminCustomerRequest = require("../../model/admin/admin_customer_request");

const createCustomerRequest = async (req, res) => {
  try {
    const {description, expectedOutcoms, requestType, preferredMediumContact, requestNumber, user} = req.body;
    const findone = await adminCustomerRequest.find({requestNumber});
    if (findone.length) {
      return res.status("400").send("one record is already exist");
    }
    await adminCustomerRequest.create({
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
const getCustomerRequest = async (req, res) => {
  try {
    const getRequestList = await adminCustomerRequest.find({});
    res.json({ success: true, getRequestList });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
const updateCustomerRequest = async (req, res) => {
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
    const findComplain = await adminCustomerRequest.findOne({_id})
    if(!findComplain.length){
      return res.status('400').send("sorry no record found")
    }
    const updateRequest = await adminCustomerRequest.findByIdAndUpdate({_id}, {$set:newData}, {new:true});
    res.json({ success: true, message:"updated" });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
module.exports = { createCustomerRequest, getCustomerRequest, updateCustomerRequest };
