const businessHappyHours = require("../../models/businessModel/bunisessHappyHours");
const businessBonusCrops = require("../../models/businessModel/businessBonusCrops");
const businessCropRules = require("../../models/businessModel/businessCropRules");
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
      return res.status(200).json({ cropRules });
    } else {
      console.log("exist running");
      console.log("body", req.body);
      const cropRules = await businessCropRules.findByIdAndUpdate(
        { _id: cropRulesFind[0]._id },
        req.body
      );
      return res.status(201).json({ cropRules });
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
      return res.status(200).json({ bonusCrops });
    } else {
      console.log("exist running");
      console.log("body", req.body);
      const bonusCrops = await businessBonusCrops.findByIdAndUpdate(
        { _id: bonusCropFind[0]._id },
        req.body
      );
      return res.status(201).json({ bonusCrops });
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
      return res.status(200).json({ slashRedemptionCrop });
    } else {
      console.log("exist running");
      console.log("body", req.body);
      const slashRedemptionCrop = await businessSlashRedemptionCrops.findByIdAndUpdate(
        { _id: slashRedemptionCropFind[0]._id },
        req.body
      );
      return res.status(201).json({ slashRedemptionCrop });
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
    const slashRedmptionCrop = await businessSlashRedemptionCrops.find({ businessId });
    return res.json({ slashRedmptionCrop });
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
      return res.status(200).json({ happyHours });
    } else {
      console.log("exist running");
      console.log("body", req.body);
      const happyHours = await businessHappyHours.findByIdAndUpdate(
        { _id: happyHoursfind[0]._id },
        req.body
      );
      return res.status(201).json({ happyHours });
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

module.exports = {
  createOrUpdateCropRules,
  getCropRules,
  createOrUpdateExtendBonusCrops,
  getExtendBonusCrops,
  createOrUpdateSlashRedeemptionCrops,
  getSlashRedemptionCrop,
  createOrUpdateHappyHours,
  getHappyHours
};
