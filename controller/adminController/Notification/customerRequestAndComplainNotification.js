const customerComplainAndRequestNotification = require("../../../models/admin/notification/customerRequestAndComplainedNotification");

const createCustomerRequestAndComplaintNotification = async (req, res) => {
  try {
    const {
      missing_points_claim,
      offers_redeemed,
      complaint,
      request,
      rate_your_experience,
      user,
    } = req.body;
    const findRecord = await customerComplainAndRequestNotification.find({});
    if (findRecord.length) {
      return res.status(400).send("record is already exist");
    }
    await customerComplainAndRequestNotification.create({
      missing_points_claim,
      offers_redeemed,
      complaint,
      request,
      rate_your_experience,
      user,
    });
    res.status(200).send("created");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("interal error");
  }
};
const getCustomerRequestAndComplaintNotification = async (req, res) => {
  try {
    const notification = await customerComplainAndRequestNotification.find({});
    res.status(200).json({ notification });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("interal error");
  }
};
const updateCustomerRequestAndComplaintNotification = async (req, res) => {
  try {
    const {
      missing_points_claim,
      offers_redeemed,
      complaint,
      request,
      rate_your_experience,
      user,
      _id,
    } = req.body;

    const findRecord = await customerComplainAndRequestNotification.findOne({
      _id,
    });
    if (!findRecord) {
      return res.status(200).send("no record found");
    }
    let newData = {};
    if (missing_points_claim) {
      newData.missing_points_claim = missing_points_claim;
    }
    if (offers_redeemed) {
      newData.offers_redeemed = offers_redeemed;
    }
    if (complaint) {
      newData.complaint = complaint;
    }
    if (request) {
      newData.request = request;
    }
    if (rate_your_experience) {
      newData.rate_your_experience = rate_your_experience;
    }

    if (findRecord.user.toString() !== user) {
      return res.status(400).send("you are not authorize");
    }
    await customerComplainAndRequestNotification.findByIdAndUpdate(
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
  createCustomerRequestAndComplaintNotification,
  getCustomerRequestAndComplaintNotification,
  updateCustomerRequestAndComplaintNotification,
};
