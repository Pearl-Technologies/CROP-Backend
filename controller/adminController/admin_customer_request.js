const adminCustomerRequest = require("../../models/admin/admin_customer_request");
const { IdGenerator } = require("custom-random-id");
const {Token} = require("../../models/User");
const ID = new IdGenerator("{{ number_7 }}");
let id = ID.getFinalExpression();
const createCustomerRequest = async (req, res) => {
  try {
    const {description, expectedOutcoms, requestType, preferredMediumContact} = req.body;
    let token= req.headers.authorization
    const token_data = await Token.findOne({ token });
    let user= token_data.user;
    // const findone = await adminCustomerRequest.find({requestNumber});
    // if (findone.length) {
    //   return res.status("400").send("one record is already exist");
    // }
    if(!description || !expectedOutcoms || !complainType, !preferredMediumContact, !user){
      return res.status(401).send({data:"all fields are required", status:(401)});
    }
    await adminCustomerRequest.create({
      description,
      expectedOutcoms,
      requestType,
      preferredMediumContact,
      requestNumber:`R-${id}`,
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
