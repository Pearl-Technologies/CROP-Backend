const businessPurchaseAndRedeemtionNotification = require("../../../models/admin/notification/businessPurchaseAndRedeemtionNotification");

const createBusinessPurchaseAndRedeemNotification = async (req, res) => {
  try {
    const {
      payment_notification,
      order_notification_for_purchase,
      redeemption_notification,
      order_notification_for_redeemption,
      user
    } = req.body;
    const findRecord = await businessPurchaseAndRedeemtionNotification.find({});
    if (findRecord.length) {
      return res.status(400).send({msg:"record is already exist"});
    }
    await businessPurchaseAndRedeemtionNotification.create({
      payment_notification,
      order_notification_for_purchase,
      redeemption_notification,
      order_notification_for_redeemption,
      user
    });
    res.status(200).send({msg:"created"});
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({msg:"interal error"});
  }
};
const getBusinessPurchaseAndRedeemNotification = async (req, res) => {
  try {
    const notification = await businessPurchaseAndRedeemtionNotification.find({});
    res.status(200).json({ notification });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({msg:"interal error"});
  }
};
const updateBusinessPurchaseAndRedeemNotification = async (req, res) => {
  try {
    const {
      payment_notification,
      order_notification_for_purchase,
      redeemption_notification,
      order_notification_for_redeemption,
      user,
      _id,
    } = req.body;

    const findRecord = await businessPurchaseAndRedeemtionNotification.findOne({ _id });
    if (!findRecord) {
      return res.status(200).send({msg:"no record found"});
    }
    let newData = {};
    if (payment_notification) {
      newData.payment_notification = payment_notification;
    }
    if (redeemption_notification) {
      newData.redeemption_notification = redeemption_notification;
    }
    if (order_notification_for_purchase) {
      newData.order_notification_for_purchase = order_notification_for_purchase;
    }
    if (order_notification_for_redeemption) {
      newData.payment_notifications = order_notification_for_redeemption;
    }
    
    if (findRecord.user.toString() !== user) {
      return res.status(400).send({msg:"you are not authorize"});
    }
    await businessPurchaseAndRedeemtionNotification.findByIdAndUpdate(
      { _id },
      { $set: newData },
      { new: true }
    );
    res.status(200).send({msg:"updated successfully"});
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({msg:"interal error"});
  }
};

module.exports = {
    createBusinessPurchaseAndRedeemNotification,
    getBusinessPurchaseAndRedeemNotification,
    updateBusinessPurchaseAndRedeemNotification
};
