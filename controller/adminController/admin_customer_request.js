const adminCustomerRequest = require("../../models/admin/admin_customer_request");

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
const {_id, requestStatus, requestResponse } = req.body;
  try {
    let newData = {};
    if(requestStatus){
      newData.requestStatus = requestStatus;
    }
    if(requestResponse){
      newData.requestResponse = requestResponse;
    }
    newData.requestUpdateDate = Date.now()
    
    const findComplain = await adminCustomerRequest.findOne({_id})
    if(!findComplain){
      return res.status(204).json({msg:"sorry no record found"})
    }
    await adminCustomerRequest.findByIdAndUpdate({_id}, {$set:newData}, {new:true});
    res.status(202).json({ msg:"updated" });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({msg:"Some Error Occured"});
  }
};
module.exports = { createCustomerRequest, getCustomerRequest, updateCustomerRequest };
