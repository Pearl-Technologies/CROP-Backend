const admin = require('../../models/superAdminModel/user');

const multer = require("multer");
var fs = require('fs');
var path = require('path');

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
    console.log(file);
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });

const updateAdminUser = (async(req, res)=>{

try {
    const {name, birthDate, agegroup, gender} = req.body;

    const imageUrl = {
			data: req.files[0]?.buffer,
			contentType: req.files[0]?.mimetype
		}

    const id=req.user.user.id;
    const newData = {};
    if (name) {
        newData.name = name;
    }
    if (imageUrl) {
        newData.imageUrl = imageUrl;
    }
    if (agegroup) {
        newData.agegroup = agegroup;
    }
    if (birthDate) {
        newData.birthDate = birthDate;
    }
    if (gender) {
        newData.gender = gender;
    }  
   
    //find the note to be updated and update
    let user = await admin.findById(id);
    if (!user) {
      return res.status(404).send("Not Found");
    }
    // if (notes.user.toString() !== req.user.id) {
    //   return res.status(404).send("Not Allowed");
    // }
    // return res.json(newData);
    user = await admin.findByIdAndUpdate(id, { $set: newData }, { new: true });
    res.json("records updated");
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
})
module.exports = updateAdminUser;