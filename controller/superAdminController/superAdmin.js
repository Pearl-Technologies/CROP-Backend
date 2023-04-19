const superAdmin = require('../../models/superAdminModel/superAdmin');
const {validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'CROP@12345'
const createSuperAdmin = (async(req, res)=>{
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }    
try {
    let user = await superAdmin.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success: false, error: "Sorry a user with this email already exits" });
    }

    //secure password by bcrypt
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);

    //create a new user
    user = await superAdmin.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Some Error Occured");
  }
})
const superAdminLogin = (async(req, res)=>{
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
  
    const { email, password } = req.body;
  
    try {
      //finding users with email id
      let user = await superAdmin.findOne({ email });
  
      if (!user) {
        success = false;
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }
      //compare password by bcrypt
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }
  
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
      // res.json(user);
    } catch (error) {
      //for log in console
      console.error(error.message);
      //for log in response
      res.status(500).send("Internal Sever Error Occured");
    }
})

module.exports = {createSuperAdmin, superAdminLogin}