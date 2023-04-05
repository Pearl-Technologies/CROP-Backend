const adminCustomerInvoice = require("../../models/admin/admin_customer_imvoice");
const adminBusinessInvoice = require("../../models/admin/admin_business_invoice");
const createCustomerInvoice = async (req, res) => {
  try {
    const {user, invoiceNumber, orderNumber, otp, promoCode, invoiceDesecription} = req.body
    await adminCustomerInvoice.create({
      user,
      invoiceNumber,
      orderNumber,
      otp,
      promoCode,
      invoiceDesecription,
    });
    res.status(200).json({message:"invoice data saved"})
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal error")
  }
};

const getAllCustomerInvoice = async (req, res) => {
  try {
    const invoices = await adminCustomerInvoice.find({});
    res.status(200).json({invoices})
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal error")
  }
};
const createBusinessInvoice = async (req, res) => {
  try {
    const {user, invoiceNumber, orderNumber, otp, promoCode, invoiceDesecription} = req.body
    await adminBusinessInvoice.create({
      user,
      invoiceNumber,
      orderNumber,
      otp,
      promoCode,
      invoiceDesecription,
    });
    res.status(200).json({message:"invoice data saved"})
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal error")
  }
};

const getAllBusinessInvoice = async (req, res) => {
  try {
    const invoices = await adminBusinessInvoice.find({});
    res.status(200).json({invoices})
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal error")
  }
};

module.exports = {createCustomerInvoice, createBusinessInvoice, getAllBusinessInvoice, getAllCustomerInvoice}

