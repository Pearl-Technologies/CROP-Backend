const admin = require("../../models/superAdminModel/user");
const bcrypt = require("bcryptjs");

const updateAdminUser = async (req, res) => {
  try {
    const {
      name,
      birthDate,
      gender,
      phone,
    } = req.body;
    let filename=undefined;
    if(req.file){
      filename = req.file.filename;
    }
    const id = req.user.user.id;
    const newData = {};
    if (name) {
      newData.name = name;
    }
    if (filename) {
      newData.filename = filename;
    }
    if (birthDate && birthDate !== "null") {
      newData.birthDate = birthDate;
    }
    if (gender) {
      newData.gender = gender;
    }
    if (phone) {
      newData.phone = phone;
    }
    //find the note to be updated and update
    let user = await admin.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "Not Found" });
    }
    user = await admin.findByIdAndUpdate(id, { $set: newData }, { new: true });
    res.status(202).json({ msg: "records updated" });
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send({msg:"Internal Server Error"});
  }
};
const updateAdminUserPassword = async (req, res) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    let newData={}
    const id = req.user.user.id;
    //find the note to be updated and update
    let user = await admin.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "Not Found" });
    }
    if (!password) {
      return res
        .status(404)
        .json({ msg: "current password should not be empty" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(401).json({ msg: "current password is not valid" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        msg: "password and confirm password is not matching",
      });
    }
    if (!newPassword || newPassword === "null") {
      return res.status(401).json({
        msg: "password should not be empty",
      });
    }
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(confirmPassword, salt);
    newData.password = secPass;

    user = await admin.findByIdAndUpdate(id, { $set: newData }, { new: true });
    res.status(202).json({ msg: "records updated" });
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).json({msg:"Internal Server Error"});
  }
};
module.exports = {updateAdminUser, updateAdminUserPassword};
