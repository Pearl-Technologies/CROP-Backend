const {
  adminPaymentTracker,
  customerPurchsedTracker,
} = require("../../../models/admin/PaymentTracker/paymentIdTracker");
const stripe = require('stripe')(process.env.STRIPE_KEY);
const SavePaymentInfo = async (
  paymentLink,
  productId,
  status,
  paymentUrl,
  businessId,
  tries
) => {
  // return console.log(paymentLink, productId, status, paymentUrl)
  try {
    if ((!paymentLink && !productId && !status, !paymentUrl)) {
      return console.log("not a valid request");
    }
    let findRecord = await adminPaymentTracker.findOne({
      paymentLink,
      productId,
    });
    if (findRecord) {
      console.log("record is already exist");
    }
    await adminPaymentTracker.create({
      paymentLink,
      productId,
      status,
      paymentUrl,
      businessId,
      tries,
    });
    console.log("saved successfully");
  } catch (error) {
    return console.log(error);
  }
};
const findPaymentInfo = async (productId) => {
  try {
    if (!productId) {
      return console.log("not a valid request");
    }
    let findRecord = await adminPaymentTracker.findOne({ productId });
    if (findRecord) {
      return findRecord;
    }
  } catch (error) {
    return console.log(error);
  }
};
const updatePaymentInfo = async (_id, tries) => {
  try {
    if (!_id && tries) {
      return console.log("not a valid request");
    }
    await adminPaymentTracker.findByIdAndUpdate({ _id }, { $set: { tries } });
  } catch (error) {
    return console.log(error);
  }
};
const findBusinessInvoice = async (req, res) => {
  const { user } = req.body;
  try {
    if (!user) {
      return res.status(200).send({ msg: "no record" });
    }
    const invoices = await adminPaymentTracker.find({ businessId: user });
    res.status(200).send({ invoices });
  } catch (error) {
    return console.log(error);
  }
};
const customerPointPurchasedTracker = async (
  paymentId,
  status,
  paymentMethod,
  paymentUrl,
  type,
  amount,
  quantity,
  user
) => {
  try {
    await customerPurchsedTracker.create({
      paymentId,
      status,
      paymentUrl,
      paymentMethod,
      type,
      amount,
      quantity,
      user,
    });
    console.log("customerPurchsedTracker created")
  } catch (error) {
    return console.log(error);
  }
};



// Route handler for transfer creation
// console.log(process.env.STRIPE_KEY)
const payToBusiness= async (req, res) => {
  // console.log(req.body);
  // res.send(req.body);
  try {
    const transfer = await stripe.transfers.create({
      amount: 1000, // Amount in cents
      currency: 'aud',
      destination: 'ca_NrVo58Lf9Y0mRM48THvbbxA69UDzE0EF',
      description: 'weekly payout',
    });

    res.json(transfer);
  } catch (error) {
    console.error(error);
    res.status(500).send({msg:'Transfer creation failed'});
  }
}

module.exports = {
  SavePaymentInfo,
  findPaymentInfo,
  updatePaymentInfo,
  findBusinessInvoice,
  customerPointPurchasedTracker,
  payToBusiness
};


