const {adminPaymentTracker, customerPurchsedTracker} = require("../../../models/admin/PaymentTracker/paymentIdTracker")


const SavePaymentInfo = async(paymentLink, productId, status, paymentUrl, businessId, tries)=>{
  // return console.log(paymentLink, productId, status, paymentUrl)
  try {
    if(!paymentLink && !productId && !status, !paymentUrl){
      return console.log("not a valid request")
    }
    let findRecord = await adminPaymentTracker.findOne({paymentLink, productId});
    if(findRecord){
      console.log("record is already exist");
    }
    await adminPaymentTracker.create({
      paymentLink,
      productId,
      status, 
      paymentUrl,
      businessId,
      tries
    })
    console.log("saved successfully")  
  } catch (error) {
    return console.log(error);
  }
}
const findPaymentInfo = async(productId)=>{
  try {
    if(!productId){
      return console.log("not a valid request")
    }
    let findRecord = await adminPaymentTracker.findOne({productId});
    if(findRecord){
      return findRecord;
    }

  } catch (error) {
    return console.log(error);
  }
}
const updatePaymentInfo = async(_id, tries)=>{
  try {
    if(!_id && tries){
      return console.log("not a valid request")
    }
    await adminPaymentTracker.findByIdAndUpdate({_id}, {$set:{tries}})

  } catch (error) {
    return console.log(error);
  }
}
const findBusinessInvoice = async(req, res)=>{
  const {user} = req.body 
  try {
    if(!user){       
      return res.status(200).send({msg:"no record"})
    }
    const invoices = await adminPaymentTracker.find({businessId:user});
    res.status(200).send({invoices});

  } catch (error) {
    return console.log(error);
  }
}
const customerPointPurchasedTracker = async(type, quantity, value)=>{
  // paymentId,
  // status,
  // paymentUrl,
  // paymentMethod,
  // invoice_url,
  // invoice_paid_time,
  // invoice_pdf,
  // customer_email,
  // invoice_id,
  // payment_intent,
  // name,
  // type,
  // amount,
  // quantity,
  // user 
  try {
    await customerPurchsedTracker.create({

    })


  } catch (error) {
    return console.log(error);
  }
}
module.exports = { SavePaymentInfo, findPaymentInfo, updatePaymentInfo, findBusinessInvoice, customerPointPurchasedTracker};



