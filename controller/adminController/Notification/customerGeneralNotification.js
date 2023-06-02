const customerGeneralNotification = require("../../../models/admin/notification/customerGeneralNotification");

const createCustomerGeneralNotification = async (req, res) => {
  try {
    const {
      business_promos,
      CROP_promos,
      offers,
      bonus_points,
      get_a_mate,
      user,
    } = req.body;
    const findRecord = await customerGeneralNotification.find({});
    if (findRecord.length) {
      return res.status(400).send("record is already exist");
    }
    await customerGeneralNotification.create({
      business_promos,
      CROP_promos,
      offers,
      bonus_points,
      get_a_mate,
      user,
    });
    res.status(200).send("created");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("interal error");
  }
};
const getCustomerGeneralNotification = async (req, res) => {
  try {
    const notification = await customerGeneralNotification.find({});
    res.status(200).json({ notification });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("interal error");
  }
};

const updateCustomerGenearlNotification = async (req, res) => {
  try {
    const {
      business_promos,
      CROP_promos,
      offers,
      bonus_points,
      get_a_mate,
      user,
      _id,
    } = req.body;

    const findRecord = await customerGeneralNotification.findOne({ _id });
    if (!findRecord) {
      return res.status(200).send({msg:"no record found"});
    }
    let newData = {};
    if (business_promos) {
      newData.business_promos = business_promos;
    }
    if (CROP_promos) {
      newData.CROP_promos = CROP_promos;
    }
    if (offers) {
      newData.offers = offers;
    }
    if (bonus_points) {
      newData.bonus_points = bonus_points;
    }
    if (get_a_mate) {
      newData.get_a_mate = get_a_mate;
    }
    
    if (findRecord.user.toString() !== user) {
      return res.status(400).send({msg:"you are not authorize"});
    }
    await customerGeneralNotification.findByIdAndUpdate(
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
  createCustomerGeneralNotification,
  getCustomerGeneralNotification,
  updateCustomerGenearlNotification
};
