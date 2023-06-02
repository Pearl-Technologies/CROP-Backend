const businessComplainAndRequestNotification = require("../../../models/admin/notification/businessRequestAndComplainNotification");

const createBusinessRequestAndComplaintNotification = async (req, res) => {
  try {
    const {
      missing_points_claim,
      complaint,
      request,
      auto_generated_service_requests,     
      user
    } = req.body;
    const findRecord = await businessComplainAndRequestNotification.find({});
    if (findRecord.length) {
      return res.status(400).send({msg:"record is already exist"});
    }
    await businessComplainAndRequestNotification.create({
      missing_points_claim,
      complaint,
      request  ,
      auto_generated_service_requests,     
      user
    });
    res.status(200).send({msg:"created"});
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({msg:"interal error"});
  }
};
const getBusinessRequestAndComplaintNotification = async (req, res) => {
  try {
    const notification = await businessComplainAndRequestNotification.find({});
    res.status(200).json({ notification });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({msg:"interal error"});
  }
};
const updateBusinessRequestAndComplaintNotification = async (req, res) => {
  try {
    const {
      missing_points_claim,
      complaint,
      request,
      auto_generated_service_requests,     
      user,
      _id,
    } = req.body;

    const findRecord = await businessComplainAndRequestNotification.findOne({
      _id,
    });
    if (!findRecord) {
      return res.status(200).send({msg:"no record found"});
    }
    let newData = {};
    if (missing_points_claim) {
      newData.missing_points_claim = missing_points_claim;
    }
    if (complaint) {
      newData.complaint = complaint;
    }
    if (request) {
      newData.request = request;
    }
    if (auto_generated_service_requests) {
      newData.auto_generated_service_requests = auto_generated_service_requests;
    }

    if (findRecord.user.toString() !== user) {
      return res.status(400).send({msg:"you are not authorize"});
    }
    await businessComplainAndRequestNotification.findByIdAndUpdate(
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
  createBusinessRequestAndComplaintNotification,
  getBusinessRequestAndComplaintNotification,
  updateBusinessRequestAndComplaintNotification,
};
