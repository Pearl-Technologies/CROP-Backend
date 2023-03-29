const adminDefaultData = require("../../model/admin/admin_default_data");

const createData = async (req, res) => {
  try {
    const { sector, user } = req.body;
    const findRecord = await adminDefaultData.find({});
    if (findRecord.length) {
      return res.status("400").send("record is exist");
    }
    await adminDefaultData.create({
      sector,
      user,
    });

    res.json({ success: true, message: "record saved" });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
const getData = async (req, res) => {
  try {
    const defaultData = await adminDefaultData.find({});
    res.json({ success: true, defaultData });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
const updateData = async (req, res) => {
  try {
    const {sector, _id} = req.body 
    const fineData = await adminDefaultData.find({_id});
    if(!fineData.length){
        return res.status(400).send("sorry record not found")
    }
    await adminDefaultData.findByIdAndUpdate({_id}, {$set:{sector}}, {new:true})
    res.json({ success: true, defaultData });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
module.exports = { createData, updateData, getData };
