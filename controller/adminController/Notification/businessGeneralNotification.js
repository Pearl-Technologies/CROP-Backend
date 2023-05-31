const businessGeneralNotification = require("../../../models/admin/notification/businessGeneralNotification");

const createBusinessGeneralNotification = async (req, res) => {
  try {
    const {
      confirmation_of_booked_promos,
      CROP_promos,
      upload_and_removal_of_offer ,
      business_insights ,      
      user
    } = req.body;
    const findRecord = await businessGeneralNotification.find({});
    if (findRecord.length) {
      return res.status(400).send({msg:"record is already exist"});
    }
    await businessGeneralNotification.create({
      confirmation_of_booked_promos,
      CROP_promos,
      upload_and_removal_of_offer ,
      business_insights ,      
      user
    });
    res.status(200).send({msg:"created"});
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({msg:"interal error"});
  }
};
const getBusinessGeneralNotification = async (req, res) => {
  try {
    const notification = await businessGeneralNotification.find({});
    res.status(200).json({ notification });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({msg:"interal error"});
  }
};

const updateBusinessGenearlNotification = async (req, res) => {
  try {
    const {
      confirmation_of_booked_promos,
      CROP_promos,
      upload_and_removal_of_offer ,
      business_insights ,      
      user,
      _id,
    } = req.body;

    const findRecord = await businessGeneralNotification.findOne({ _id });
    if (!findRecord) {
      return res.status(200).send({msg:"no record found"});
    }
    let newData = {};
    if (confirmation_of_booked_promos) {
      newData.confirmation_of_booked_promos = confirmation_of_booked_promos;
    }
    if (CROP_promos) {
      newData.CROP_promos = CROP_promos;
    }
    if (upload_and_removal_of_offer) {
      newData.upload_and_removal_of_offer = upload_and_removal_of_offer;
    }
    if (business_insights) {
      newData.business_insights = business_insights;
    }

    
    if (findRecord.user.toString() !== user) {
      return res.status(400).send({msg:"you are not authorize"});
    }
    await businessGeneralNotification.findByIdAndUpdate(
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
  createBusinessGeneralNotification,
  getBusinessGeneralNotification,
  updateBusinessGenearlNotification
};
