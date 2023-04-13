const businessHappyHours = require("../../models/businessModel/bunisessHappyHours");
const businessBonusCrops = require("../../models/businessModel/businessBonusCrops");
const businessCropRules = require("../../models/businessModel/businessCropRules");
const businessOtherServices = require("../../models/businessModel/businessOtherServices");
const businessSlashRedemptionCrops = require("../../models/businessModel/businessSlashRedeemptionCrops");

const createOrUpdateCropRules = async (req, res) => {
  const businessId = req.user.user.id;
  try {
    const cropRulesFind = await businessCropRules.find({ businessId });
    if (cropRulesFind.length <= 0) {
      req.body.businessId = businessId;
      console.log(req.body);
      const cropRules = new businessCropRules(req.body);
      await cropRules.save();
      return res.status(200).json({ success: true, cropRules });
    } else {
      console.log("exist running");
      console.log("body", req.body);
      const cropRules = await businessCropRules.findByIdAndUpdate(
        { _id: cropRulesFind[0]._id },
        req.body
      );
      return res.status(201).json({success: true, cropRules });
    }
  } catch (error) {
    console.log("err start", error, "error end");
    res.status(500).send("Internal Sever Error Occured");
  }
};

const getCropRules = async (req, res) => {
  const businessId = req.user.user.id;
  try {
    const cropRulesFind = await businessCropRules.find({ businessId });
    return res.json({ cropRulesFind });
  } catch (error) {
    console.log("err start", error, "error end");
    res.status(500).send("Internal Sever Error Occured");
  }
};

const createOrUpdateExtendBonusCrops = async (req, res) => {
  const businessId = req.user.user.id;
  try {
    const bonusCropFind = await businessBonusCrops.find({ businessId });
    if (bonusCropFind.length <= 0) {
      req.body.businessId = businessId;
      console.log(req.body);
      const bonusCrops = new businessBonusCrops(req.body);
      await bonusCrops.save();
      return res.status(200).json({ success: true, bonusCrops });
    } else {
      console.log("exist running");
      console.log("body", req.body);
      const bonusCrops = await businessBonusCrops.findByIdAndUpdate(
        { _id: bonusCropFind[0]._id },
        req.body
      );
      return res.status(201).json({ success: true, bonusCrops });
    }
  } catch (error) {
    console.log("err start", error, "error end");
    res.status(500).send("Internal Sever Error Occured");
  }
};

const getExtendBonusCrops = async (req, res) => {
  console.log(req.user);
  const businessId = req.user.user.id;
  console.log("Api running");
  console.log({ businessId });
  try {
    const bonusCrops = await businessBonusCrops.find({ businessId });
    return res.json({ bonusCrops });
  } catch (error) {
    console.log("err start", error, "error end");
    res.status(500).send("Internal Sever Error Occured");
  }
};

const createOrUpdateSlashRedeemptionCrops = async (req, res) => {
  const businessId = req.user.user.id;
  try {
    const slashRedemptionCropFind = await businessSlashRedemptionCrops.find({ businessId });
    if (slashRedemptionCropFind.length <= 0) {
      req.body.businessId = businessId;
      console.log(req.body);
      const slashRedemptionCrop = new businessSlashRedemptionCrops(req.body);
      await slashRedemptionCrop.save();
      return res.status(200).json({ success: true, slashRedemptionCrop });
    } else {
      console.log("exist running");
      console.log("body", req.body);
      const slashRedemptionCrop = await businessSlashRedemptionCrops.findByIdAndUpdate(
        { _id: slashRedemptionCropFind[0]._id },
        req.body
      );
      return res.status(201).json({ success: true, slashRedemptionCrop });
    }
  } catch (error) {
    console.log("err start", error, "error end");
    res.status(500).send("Internal Sever Error Occured");
  }
};

const getSlashRedemptionCrop = async (req, res) => {
  console.log(req.user);
  const businessId = req.user.user.id;
  console.log("Api running");
  console.log({ businessId });
  try {
    const slashRedemptionCrop = await businessSlashRedemptionCrops.find({ businessId });
    return res.json({ slashRedemptionCrop });
  } catch (error) {
    console.log("err start", error, "error end");
    res.status(500).send("Internal Sever Error Occured");
  }
};

const createOrUpdateHappyHours = async (req, res) => {
  const businessId = req.user.user.id;
  try {
    const happyHoursfind = await businessHappyHours.find({ businessId });
    if (happyHoursfind.length <= 0) {
      req.body.businessId = businessId;
      console.log(req.body);
      const happyHours = new businessHappyHours(req.body);
      await happyHours.save();
      return res.status(200).json({success:true, happyHours });
    } else {
      console.log("exist running");
      console.log("body", req.body);
      const happyHours = await businessHappyHours.findByIdAndUpdate(
        { _id: happyHoursfind[0]._id },
        req.body
      );
      return res.status(201).json({ success: true, happyHours });
    }
  } catch (error) {
    console.log("err start", error, "error end");
    res.status(500).send("Internal Sever Error Occured");
  }
};

const getHappyHours = async (req, res) => {
  console.log(req.user);
  const businessId = req.user.user.id;
  console.log("Api running");
  console.log({ businessId });
  try {
    const happyHours = await businessHappyHours.find({ businessId });
    return res.json({ happyHours });
  } catch (error) {
    console.log("err start", error, "error end");
    res.status(500).send("Internal Sever Error Occured");
  }
};

const createOrUpdateOtherServices = async (req, res) => {
  const businessId = req.user.user.id;
  try {
    const otherServicesFind = await businessOtherServices.find({ businessId });
    if (otherServicesFind.length <= 0) {
      req.body.businessId = businessId;
      console.log(req.body);
      const otherServices = new businessOtherServices(req.body);
      await otherServices.save();
      return res.status(200).json({ success: true, otherServices });
    } else {
      console.log("exist running");
      console.log("body", req.body);
      const otherServices = await businessOtherServices.findByIdAndUpdate(
        { _id: otherServicesFind[0]._id },
        req.body
      );
      return res.status(201).json({ success: true, otherServices });
    }
  } catch (error) {
    console.log("err start", error, "error end");
    res.status(500).send("Internal Sever Error Occured");
  }
};

const getOtherServices = async (req, res) => {
  console.log(req.user);
  const businessId = req.user.user.id;
  console.log("Api running");
  console.log({ businessId });
  try {
    const otherServices = await businessOtherServices.find({ businessId });
    return res.json({ otherServices });
  } catch (error) {
    console.log("err start", error, "error end");
    res.status(500).send("Internal Sever Error Occured");
  }
};
const createMissingCrops = async (req, res) => {
  const {
    customerName,
    customerId,
    productName,
    productId,
    dateOfInvoice,
    copyOfInvoice,
    reasonForClaim,
    status,
    businessId,
  } = req.body
  try {
    const missingCrops = new processMissingCrops({
      customerName,
      customerId,
      productName,
      productId,
      dateOfInvoice,
      copyOfInvoice,
      reasonForClaim,
      status,
      businessId,
    })
    await missingCrops.save()
    return res
      .status(201)
      .send({ success: true, msg: "Request Sent Successfully" })
  } catch (error) {
    console.log("err start", error, "error end")
    res.status(500).send("Internal Sever Error Occured")
  }
}

const getMissingCropsByCustomer = async (req, res) => {
  const customerId = req.user.user.id
  try {
    const missingCrops = await processMissingCrops.find({ customerId })
    return res.status(200).send({
      success: true,
      missingCrops,
      msg: "Missing Crop Details Sended Successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Sever Error Occured")
  }
}

const getMissingCropsByBusiness = async (req, res) => {
  const businessId = req.user.user.id
  try {
    const missingCrops = await processMissingCrops.find({ businessId })
    return res.status(200).send({
      success: true,
      missingCrops,
      msg: "Missing Crop Details Sended Successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Sever Error Occured")
  }
}

const updateMissingCrops = async (req, res) => {
  const businessId = req.user.user.id
  const { id, status, customerId } = req.body
  try {
    const mCrops = await processMissingCrops.findById(id)
    if (!mCrops) {
      return res
        .status(404)
        .send({ success: false, msg: "Mssing Crops Not Found" })
    }
    if (status == "approve") {
      const customer = await User.findById(customerId)
      const customerCropPoints = customer.croppoints
      const croppoints = mCrops.crops + customerCropPoints
      await User.findByIdAndUpdate.findByIdAndUpdate(
        { _id: customerId },
        { croppoints }
      )
    }
    const missingCrops = await processMissingCrops.findByIdAndUpdate(
      { _id: id },
      { status }
    )
    return res.status(200).send({
      success: true,
      missingCrops,
      msg: "Missing Crop Details Sended Successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Sever Error Occured")
  }
}

module.exports = {
  createOrUpdateCropRules,
  getCropRules,
  createOrUpdateExtendBonusCrops,
  getExtendBonusCrops,
  createOrUpdateSlashRedeemptionCrops,
  getSlashRedemptionCrop,
  createOrUpdateHappyHours,
  getHappyHours,
  createOrUpdateOtherServices,
  getOtherServices,
  createMissingCrops,
  getMissingCropsByCustomer,
  getMissingCropsByBusiness,
  updateMissingCrops,
}
