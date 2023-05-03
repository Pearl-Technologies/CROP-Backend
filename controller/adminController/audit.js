const audit = require("../../models/admin/admin_audit");
const businessAudit = require("../../models/admin/admin_busin_audit");
const customerAudit = require("../../models/admin/admin_customer_audit")
const createAudit = async (req, res) => {
  try {
    const { description, user } = req.body;
    await audit.create({
      description,
      user,
    });

    res.status(200).json({ msg: "audit updated" });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
const getAuditReport = async (req, res) => {
  try {
    const auditReport = await audit.find({});
    res.status(200).json({auditReport });
  } catch (error) {
    console.error(error.message);

    res.status(500).send({msg:"Some Error Occured"});
  }
};
const createBusinessAudit = async (user, description) => {
  try {
    await businessAudit.create({
      description,
      user,
    });
    console.log("business audit data created");
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
  }
};
const getBusinessAuditReport = async (req, res) => {
  try {
    const auditReport = await businessAudit.find({});
    res.json({auditReport });
  } catch (error) {
    console.error(error.message);

    res.status(500).send({msg:"Some Error Occured"});
  }
};
const createCustomerAudit = async (user, description) => {
  try {
    console.log(user, description)
    await customerAudit.create({
      description,
      user,
    });
    console.log("audit created")
    // res.status(200).json({msg: "audit updated" });
  } catch (error) {
    console.error(error.message);
    // res.status(500).send({msg:"Some Error Occured"});
  }
};
const getCustomerAuditReport = async (req, res) => {
  console.log(req.query.q)
  let user = req.query.q
  try {
    const auditReport = await customerAudit.find({user});
    res.json({auditReport });
  } catch (error) {
    console.error(error.message);

    res.status(500).send({msg:"Some Error Occured"});
  }
};
module.exports = { createAudit, getAuditReport, createBusinessAudit, getBusinessAuditReport, getCustomerAuditReport, createCustomerAudit };
