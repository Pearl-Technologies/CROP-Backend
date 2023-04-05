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
    const {type, description, crop}=req.body;
    let user = req.user.user.id;
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
const getAllBusinessCrop = async(req, res)=>{
  try {
      let cropDetails = await adminBusinessCrop.find({})
      res.status(201).json({cropDetails});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}
const updateBusinessAccountStatus=async(req, res)=>{
  try {
    const {_id, status}=req.body;
    console.log(req.body);
    const findAccount = await business.findOne({_id});
    if(!findAccount){
      return res.status(400).send("no data found");
    }
    await business.findByIdAndUpdate({_id}, {$set:{status}}, {new:true});
  } catch (error) {
    console.log(error);
  }
}

module.exports = {getAllBusiness, businessCrop, getAllBusinessCrop, updateBusinessAccountStatus}
