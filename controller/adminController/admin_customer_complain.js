const adminCustomerComplain = require("../../models/admin/admin_customer_complain");
const adminCustomerRequestAndComplainedNotification = require("../../models/admin/notification/customerRequestAndComplainedNotification")
const {ComplainNotificationCustomer} = require("../../models/notification");
const { IdGenerator } = require("custom-random-id");
const {Token} = require("../../models/User");
const ID = new IdGenerator("{{ number_7 }}");
let id = ID.getFinalExpression();
const createCustomerComplain = async (req, res) => {
  let token= req.headers.authorization
    const token_data = await Token.findOne({ token });
    let user= token_data.user;
  try {
    const {
      description,
      expectedOutcoms,
      complainType,
      preferredMediumContact,
    } = req.body;
    if(!description || !expectedOutcoms || !complainType, !preferredMediumContact, !user){
      return res.status(401).send({data:"all fields are required", status:(401)});
    }
    await adminCustomerComplain.create({
      description,
      expectedOutcoms,
      complainType,
      preferredMediumContact,
      complainNumber:id,
      user,
    });
    
    let notification = await adminCustomerRequestAndComplainedNotification.find();
    notification = notification[0]._doc
    await new ComplainNotificationCustomer({user_id: userData._id, message: notification.complaint}).save();
    res.json({ success: true, message: "updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
  }
};
const getCustomerComplain = async (req, res) => {
  try {
    const getComplainList = await adminCustomerComplain.find({});
    res.json({ success: true, getComplainList });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
const updateCustomerComplain = async (req, res) => {
  const { _id, complainStatus, complainResponse } = req.body;
  try {
    let newData = {};
    newData.complainUpdateDate = Date.now();

    if (complainStatus) {
      newData.complainStatus = complainStatus;
    }
    if (complainResponse) {
      newData.complainResponse = complainResponse;
    }
    const findComplain = await adminCustomerComplain.findOne({ _id });
    if (!findComplain) {
      return res.status(204).json({ msg: "sorry no record found" });
    }
    await adminCustomerComplain.findByIdAndUpdate(
      { _id },
      { $set: newData },
      { new: true }
    );
    res.status(202).json({ msg: "updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Some Error Occured" });
  }
};
module.exports = {
  createCustomerComplain,
  getCustomerComplain,
  updateCustomerComplain,
};
