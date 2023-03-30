const admin = require('../../models/superAdminModel/user');
const {validationResult } = require("express-validator");

const updateAdminUser = (async(req, res)=>{
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
// console.log(req.body);
try {
    const {name, email, birthDate, agegroup, gender} = req.body;
    const imageUrl  = req.body.photo
    const id=req.user.user.id;
    const newRights = {};
    if (name) {
        newRights.name = name;
    }
    if (email) {
        newRights.email = email;
    }
    if (imageUrl) {
        newRights.imageUrl = imageUrl;
    }
    if (agegroup) {
        newRights.agegroup = agegroup;
    }
    if (birthDate) {
        newRights.birthDate = birthDate;
    }
    if (gender) {
        newRights.gender = gender;
    }  
    //find the note to be updated and update
    let user = await admin.findById(id);
    if (!user) {
      return res.status(404).send("Not Found");
    }
    // if (notes.user.toString() !== req.user.id) {
    //   return res.status(404).send("Not Allowed");
    // }
    user = await admin.findByIdAndUpdate(id, { $set: newRights }, { new: true });
    res.json("records updated");
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
})
module.exports = updateAdminUser;