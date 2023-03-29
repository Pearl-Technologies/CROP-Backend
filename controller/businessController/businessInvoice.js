const invoice = require("../../models/businessModel/businessInvoices");
const { validationResult } = require("express-validator");
const saveInvoice = (async(req, res)=>{
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }    
try {
    const { invoiceNumber, otp, promoCode, invoiceDesecription, userId, orderNumber} = req.body;
    let transInvoice = await invoice.findOne({ invoiceNumber });

    if (transInvoice) {
      return res.status(400).json({ success: false, error: "Sorry a invoice with this id already exits" });
    }

    transInvoice = await invoice.create({
        invoiceNumber: cropId,
        otp: otp,
        promoCode:promoCode,
        invoiceDesecription:invoiceDesecription,
        orderNumber,
        userId
    });
    success = true;
    let message="invoice saved successfully"
    res.json({ success, message });
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Some Error Occured");
  }
})
const getInvoices = (async(req, res)=>{
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }    
try {
    const { category } = req.body;
    let transInvoice = await invoice.find({category});
    
    res.json({ transInvoice});
    // res.json(user);
  } catch (error) {
    //for log in console
    console.error(error.message);
    //for log in response
    res.status(500).send("Some Error Occured");
  }
})

module.exports = {saveInvoice, getInvoices}