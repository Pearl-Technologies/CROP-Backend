const audit = require("../../models/admin/admin_audit");

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
module.exports = { createAudit, getAuditReport };
