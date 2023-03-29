const adminMilestone = require("../../model/admin/admin_milestone");

const createMilestoneData = async (req, res) => {
  try {
    const { first, second, third, fourth, user } = req.body;
    const findone = await adminMilestone.find({});
    if(findone.length){
        return res.status('400').send("one record is already exist")
    }
    await adminMilestone.create({
      first,
      second,
      third,
      fourth,
      user
    });
    res.json({ success: true, message: "updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
  }
};
const getMilestoneData = async (req, res) => {
  try {
    const milestoneReport = await adminMilestone.find({});
    res.json({ success: true, milestoneReport });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
module.exports = { createMilestoneData, getMilestoneData };
