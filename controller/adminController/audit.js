const audit = require("../../models/admin/admin_audit");
const businessAudit = require("../../models/admin/admin_busin_audit");
const createAudit = async (req, res) => {
  try {
    const { description, user } = req.body;
    await audit.create({
      description,
      user,
    });

    res.json({ success: true, message: "audit updated" });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
const getAuditReport = async (req, res) => {
  try {
    const auditReport = await audit.find({});
    res.json({ success: true, auditReport });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
const createBusinessAudit = async (req, res) => {
  try {
    const { description, user } = req.body;
    await businessAudit.create({
      description,
      user,
    });

    res.status(200).json({message: "audit updated" });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
const getBusinessAuditReport = async (req, res) => {
  try {
    const auditReport = await businessAudit.find({});
    res.json({ success: true, auditReport });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
module.exports = { createAudit, getAuditReport, createBusinessAudit, getBusinessAuditReport };
