const {User} = require("../../../models/User");
const Order = require('../../../models/Order');
const adminCustomerCrop = require('../../../models/admin/admin_customer_crop');
const adminCustomerProp = require('../../../models/admin/admin_customer_prop');

const getAllCustomer = async (req, res) => {
  try {
    const customers = await User.find({});
    res.status(200).json({ customers });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const getAllOrders = async(req, res)=>{
    try {
        const orders = await Order.find({});
        res.status(200).json({orders});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}
const customerCrop = async(req, res)=>{
  try {
    const {type, description, crop}=req.body;
    let user = req.user.user.id;
    if(type == "credit"){
      await adminCustomerCrop.create({
        credit:crop,
        description,
        user,
      })
      res.status(201).send("updated");
    }else if(type =="debit"){
      await adminCustomerCrop.create({
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
const getAllCustomerCrop = async(req, res)=>{
  try {
    const cropDetails = await adminCustomerCrop.find({})
     res.status(200).json({cropDetails});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}
const customerProp = async(req, res)=>{
  try {
    const {type, description, crop}=req.body;
    let user = req.user.user.id;
    if(type == "credit"){
      await adminCustomerProp.create({
        credit:crop,
        description,
        user,
      })
      res.status(201).send("updated");
    }else if(type =="debit"){
      await adminCustomerProp.create({
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
const getAllCustomerProp = async(req, res)=>{
  try {
    const propDetails = await adminCustomerProp.find({})
     res.status(200).json({propDetails});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}
const updateCustomerStatus = async (req, res) => {
  const {_id, status} = req.body
  try {
    const customer = await User.findOne({_id});
    if(!customer){
      return res.status(404).json({msg:"no data found"});
    }
    await User.findByIdAndUpdate({_id}, {status})
    res.status(200).json({msg:"updated"});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({msg:"Internal Server Error"});
  }
};
const getAllCustomerByContent = async (req, res) => {
  let customerDetails;
  try {
    // let { customerName, email, pincode } = req.body;
    // if (customerName && email && pincode) {
    //   Zip_code = parseInt(Zip_code)
    //   customerDetails = await business.aggregate([
    //     {
    //       $unwind: {
    //         'path':'$address'
    //       },
    //     },
    //     {
    //       $match: {
    //         "address.pincode": Zip_code,
    //         'natureOfBusiness':{'$regex':natureOfBusiness},
    //         'businessName':{'$regex':businessName}
    //       },
    //     },
    //   ]);
    //   return res.status(200).json({ businessDetails });
    // }
    // if (natureOfBusiness && businessName) {
    //   businessDetails = await business.aggregate([
    //     {
    //       $unwind: {
    //         'path':'$address'
    //       },
    //     },
    //     {
    //       $match: {
    //         'natureOfBusiness':{'$regex':natureOfBusiness},
    //         'businessName':{'$regex':businessName}
    //       },
    //     },
    //   ]);
    //   return res.status(200).json({ businessDetails });
    // }
    // if (natureOfBusiness && Zip_code) {
    //   Zip_code = parseInt(Zip_code)
    //   businessDetails = await business.aggregate([
    //     {
    //       $unwind: {
    //         'path':'$address'
    //       },
    //     },
    //     {
    //       $match: {
    //         "address.pincode": Zip_code,
    //         "natureOfBusiness":{'$regex':natureOfBusiness}
    //       },
    //     },
    //   ]);
    //   return res.status(200).json({ businessDetails });
    // }
    // if (natureOfBusiness) {
    //   let businessDetails = await business.find({ natureOfBusiness:{$regex:natureOfBusiness} });
    //   return res.status(200).json({ businessDetails });
    // }
    // if (businessName) {
    //   businessDetails = await business.find({
    //     businessName:{$regex:businessName}
    //   });
    //   return res.status(200).json({ businessDetails });
    // }
    // if (Zip_code) {
    //   Zip_code = parseInt(Zip_code)
    //   businessDetails = await business.aggregate([
    //     {
    //       '$unwind': {
    //         'path':'$address'
    //       }
    //     },
    //     {
    //       '$match': {
    //         "address.pincode": Zip_code,
    //       },
    //     },
    //   ]);
     
    //   return res.status(200).json({ businessDetails });
    // }
    customerDetails = await User.find({}, {name:1, address:1, email:1})
    res.status(200).json({customerDetails});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({msg:"internal error"});
  }
};
module.exports = {getAllCustomerByContent, getAllCustomer, getAllOrders, customerProp, customerCrop, getAllCustomerProp, getAllCustomerCrop, updateCustomerStatus}
