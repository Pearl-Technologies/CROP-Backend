const adminNotification = require("../../models/admin/adminNotification");

const createNotification = async (req, res) => {
  try {
    const { description, type } = req.body;
    await adminNotification.create({
      type,
      description,
    });

    res.status(200).json({message: "created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
  }
};
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await adminNotification.find({});
    res.json({notifications });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
module.exports = { createNotification, getAllNotifications };
