const business = require("../../../models/businessModel/business");
const adminBusinessCrop  = require("../../../models/admin/admin_business_crop")
const getAllBusiness = async (req, res) => {
  try {
    const businesses = await business.find({});
    res.status(200).json({ businesses });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const businessCrop = async(req, res)=>{
  try {
    const {type, description, user, crop}=req.body;
    if(type == "credit"){
      await adminBusinessCrop.create({
        credit:crop,
        description,
        user,
      })
      res.status(201).send("updated");
    }else if(type =="debit"){
      await adminBusinessCrop.create({
        debit:crop,
        description,
        user
      })
      res.status(201).send("updated");
    }else{
      res.status(400).send("bad request! not updated");
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {getAllBusiness, businessCrop}
