const admin = require('../../model/superAdminModel/user');
const {validationResult } = require("express-validator");
// const user = new admin({ name: 'pradeep' });
// user.save().then(() => console.log('hello'));

const AllowRight = (async(req, res)=>{
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
try {
    const { _id, invoiceCycle, businessTier, customerTier, serviceRequest, complaint,
        orderRevocation,
        survayDesign,
        serviceChange,
        notifications,
        notificationsContent,
        pricing,
        subscription_frequencies,
        earnPoint_valuation,
        redeemPoint_valuation,
        massNotifications } = req.body;
const id = _id;
    const newRights = {};
    if (invoiceCycle) {
        newRights.invoiceCycle = invoiceCycle;
    }
    if (businessTier) {
        newRights.businessTier = businessTier;
    }
    if (customerTier) {
        newRights.customerTier = customerTier;
    }
    if (serviceRequest) {
        newRights.serviceRequest = serviceRequest;
    }
    if (complaint) {
        newRights.complaint = complaint;
    }
    if (orderRevocation) {
        newRights.orderRevocation = orderRevocation;
    }
    if (survayDesign) {
        newRights.survayDesign = survayDesign;
    }
    if (serviceChange) {
        newRights.serviceChange = serviceChange;
    }
    if (notifications) {
        newRights.notifications = notifications;
    }
    if (notificationsContent) {
        newRights.notificationsContent = notificationsContent;
    }
    if (pricing) {
        newRights.pricing = pricing;
    }
    
    if (subscription_frequencies) {
        newRights.subscription_frequencies = subscription_frequencies;
    }
    if (earnPoint_valuation) {
        newRights.earnPoint_valuation = earnPoint_valuation;
    }
    if (redeemPoint_valuation) {
        newRights.redeemPoint_valuation = redeemPoint_valuation;
    }
    if (massNotifications) {
        newRights.massNotifications = massNotifications;
    }
    
    //find the note to be updated and update
    let user = await admin.findById(id);
    if (!user) {
      return res.status(404).send("Not Found");
    }
    // if (notes.user.toString() !== req.user.id) {
    //   return res.status(404).send("Not Allowed");
    // }
    user = await admin.findByIdAndUpdate(id, { $set: newRights }, { new: true });
    res.json("records updated");
  } catch (error) {
    console.error(error.message);
    //for log in response
    res.status(500).send("Internal Server Error");
  }
})
module.exports = AllowRight;