const customerPurchaseAndRedeemtionNotification = require("../../../models/admin/notification/customerPurchaseAndRedeemtionNotification");

const createCustomerPurchaseAndRedeemNotification = async (req, res) => {
  try {
    const {
      offers_purchased,
      offers_redeemed,
      points_purchased,
      payment_notifications,
      e_vouchers,
      user,
    } = req.body;
    const findRecord = await customerPurchaseAndRedeemtionNotification.find({});
    if (findRecord.length) {
      return res.status(400).send("record is already exist");
    }
    await customerPurchaseAndRedeemtionNotification.create({
      offers_purchased,
      offers_redeemed,
      points_purchased,
      payment_notifications,
      e_vouchers,
      user,
    });
    res.status(200).send("created");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("interal error");
  }
};
const getCustomerPurchaseAndRedeemNotification = async (req, res) => {
  try {
    const notification = await customerPurchaseAndRedeemtionNotification.find({});
    res.status(200).json({ notification });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("interal error");
  }
};
const updateCustomerPurchaseAndRedeemNotification = async (req, res) => {
  try {
    const {
      offers_purchased,
      offers_redeemed,
      points_purchased,
      payment_notifications,
      e_vouchers,
      user,
      _id,
    } = req.body;

    const findRecord = await customerPurchaseAndRedeemtionNotification.findOne({ _id });
    if (!findRecord) {
      return res.status(200).send("no record found");
    }
    let newData = {};
    if (offers_purchased) {
      newData.offers_purchased = offers_purchased;
    }
    if (offers_redeemed) {
      newData.offers_redeemed = offers_redeemed;
    }
    if (points_purchased) {
      newData.points_purchased = points_purchased;
    }
    if (payment_notifications) {
      newData.payment_notifications = payment_notifications;
    }
    if (e_vouchers) {
      newData.e_vouchers = e_vouchers;
    }
    
    if (findRecord.user.toString() !== user) {
      return res.status(400).send("you are not authorize");
    }
    await customerPurchaseAndRedeemtionNotification.findByIdAndUpdate(
      { _id },
      { $set: newData },
      { new: true }
    );
    res.status(200).send("updated");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("interal error");
  }
};

module.exports = {
    createCustomerPurchaseAndRedeemNotification,
    getCustomerPurchaseAndRedeemNotification,
    updateCustomerPurchaseAndRedeemNotification
};