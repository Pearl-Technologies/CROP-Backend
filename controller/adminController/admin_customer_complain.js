const adminCustomerComplain = require("../../models/admin/admin_customer_complain");
const adminCustomerRequestAndComplainedNotification = require("../models/admin/notification/customerRequestAndComplainedNotification")
const {ComplainNotificationCustomer} = require("../models/notification");
const createCustomerComplain = async (req, res) => {
  try {
    const {
      description,
      expectedOutcoms,
      complainType,
      preferredMediumContact,
      complainNumber,
      user,
    } = req.body;
    const findone = await adminCustomerComplain.find({ complainNumber });
    if (findone.length) {
      return res.status("400").send("one record is already exist");
    }
    await adminCustomerComplain.create({
      description,
      expectedOutcoms,
      complainType,
      preferredMediumContact,
      complainNumber,
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
