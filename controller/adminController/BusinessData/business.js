const business = require("../../../models/businessModel/business");
const adminBusinessCrop = require("../../../models/admin/admin_business_crop");
const getAllBusiness = async (req, res) => {
  try {
    const businesses = await business.find({});
    res.status(200).json({ businesses });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const businessCrop = async (req, res) => {
  try {
    const { type, description, crop } = req.body;
    let user = req.user.user.id;
    if (type == "credit") {
      await adminBusinessCrop.create({
        credit: crop,
        description,
        user,
      });
      res.status(201).send("updated");
    } else if (type == "debit") {
      await adminBusinessCrop.create({
        debit: crop,
        description,
        user,
      });
      res.status(201).send("updated");
    } else {
      res.status(400).send("bad request! not updated");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const getAllBusinessCrop = async (req, res) => {
  try {
    let cropDetails = await adminBusinessCrop.find({});
    res.status(201).json({ cropDetails });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const updateBusinessAccountStatus = async (req, res) => {
  try {
    const { _id, status } = req.body;
    console.log(req.body);
    const findAccount = await business.findOne({ _id });
    if (!findAccount) {
      return res.status(400).send("no data found");
    }
    await business.findByIdAndUpdate(
      { _id },
      { $set: { status } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};
const getAllBusinessByContent = async (req, res) => {
  let businessDetails;
  try {
    let { Zip_code, natureOfBusiness, businessName } = req.body;
    if (natureOfBusiness && businessName && Zip_code) {
      Zip_code = parseInt(Zip_code)
      businessDetails = await business.aggregate([
        {
          $unwind: "$address",
        },
        {
          $match: {
            "address.Zip_code": Zip_code,
            natureOfBusiness,
            "businessId.BusinessName": businessName,
          },
        },
      ]);
      return res.status(200).json({ businessDetails });
    }
    if (natureOfBusiness && businessName) {
      businessDetails = await business.aggregate([
        {
          $unwind: "$address",
        },
        {
          $match: {
            natureOfBusiness,
            "businessId.BusinessName": businessName,
          },
        },
      ]);
      return res.status(200).json({ businessDetails });
    }
    if (natureOfBusiness && Zip_code) {
      Zip_code = parseInt(Zip_code)
      businessDetails = await business.aggregate([
        {
          $unwind: "$address",
        },
        {
          $match: {
            "address.Zip_code": Zip_code,
            natureOfBusiness
          },
        },
      ]);
      return res.status(200).json({ businessDetails });
    }
    if (natureOfBusiness) {
      let businessDetails = await business.find({ natureOfBusiness });
      return res.status(200).json({ businessDetails });
    }
    if (businessName) {
      businessDetails = await business.find({
        "businessId.BusinessName": businessName,
      });
      return res.status(200).json({ businessDetails });
    }
    if (Zip_code) {
      Zip_code = parseInt(Zip_code)
      businessDetails = await business.aggregate([
        {
          $unwind: "$address",
        },
        {
          $match: {
            "address.Zip_code": Zip_code,
          },
        },
      ]);
      return res.status(200).json({ businessDetails });
    }
    businessDetails = await business.find();
    res.status(200).json({businessDetails});
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal error");
  }
};
module.exports = {
  getAllBusinessByContent,
  getAllBusiness,
  businessCrop,
  getAllBusinessCrop,
  updateBusinessAccountStatus,
};
