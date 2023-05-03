const cart = require('./cart.json')
const business = require("../models/businessModel/business")
const User = require("../models/User")
const businessNotification = require('../models/businessModel/businessNotification/invoiceAndPaymentNotification')

// type:"Order Notification for purchase"
// desc:"your product has been purchase"
// businessId:
// payment:{
//   trasactionId
// }
// purchaseOrder:{
//   orderId
// }
// redeemtionOrder:{
//   orderId
// }

let cropPoint = 0;
for(let i=0; i<cartDetails.cartItems.length; i++){
  cropPoint+=parseFloat(cartDetails.cartItems[i].cropRulesWithBonus*cartQuantity)
  console.log('product id', cartDetails.cartItems[i]._id )
  console.log('business id', cartDetails.cartItems[i]?.user )
  const user = cartDetails.cartItems[i]?.user
  const findBusiness = business.findOne({_id:user})
  let cropPoint = findBusiness.croppoint -((cartDetails.cartItems[i].cartQuantity)*cartDetails.cartItems[i].cropRulesWithBonus)
  business.findByIdAndUpdate({_id:findBusiness._id}, {$set:{croppoint:cropPoint}}, {new:true});
  //business notification
//   businessNotification.create({
//     type:"Order Notification for purchase",
//     desc:"your product has been purchase",
//     businessId:user,
//     payment:{
//   trasactionId
// },
// purchaseOrder:{
//   orderId
// }

//   })
  

}
let customer = req.body.user_id;
let findOneCustomer = User.findOne({_id:customer});
let customerNewCropPoint = findOneCustomer.croppoint+cropPoint;
User.findByIdAndUpdate({_id:findOneCustomer._id}, {$set:{croppoint:customerNewCropPoint}}, {new:true}) 

console.log(cropPoint);
console.log("userid", cartDetails.user_id)
console.log("cartId", cartDetails.id)



//  "invoice.payment_succeeded": {
//   const session = event.data.object;
//   let findOne = await adminPaymentTracker.findOne({
//     payment_intent: session.payment_intent,
//   });
//   if (await findOne) {
//     await adminPaymentTracker.findByIdAndUpdate(
//       { _id: findOne._id },
//       {
//         $set: {
//           status: session.status,
//           invoice_paid_time: session.created,
//           customer_email: session.customer_email,
//           invoice_id: session.id,
//           invoice_url: session.hosted_invoice_url,
//           invoice_pdf: session.invoice_pdf,
//         },
//       }
//     );
//     // , hosted_invoice_url,: "",
//     console.log("business invoices successfully updated");
//   }

//   let findOneRecord = await customerPaymentTracker.findOne({
//     payment_intent: session.payment_intent,
//   });
//   if (await findOneRecord) {
//     await customerPaymentTracker.findByIdAndUpdate(
//       { _id: findOneRecord._id },
//       {
//         $set: {
//           status: session.status,
//           invoice_paid_time: session.created,
//           customer_email: session.customer_email,
//           invoice_id: session.id,
//           invoice_url: session.hosted_invoice_url,
//           invoice_pdf: session.invoice_pdf,
//           customer_shipping: session.customer_shipping,
//           customer_address: session.customer_address,
//           number: session.number,
//           name:session.customer_name
//         },
//       }
//     );
//     // , hosted_invoice_url,: "",
//     console.log("customer invoices successfully updated");
//   } else {
//     console.log("record is not found for updating invoice details");
//   }
//   let { cartDetails } = findOneRecord;
//   var customerCropPoint = 0;
//   for (let i = 0; i < cartDetails.cartItems.length; i++) {
//     customerCropPoint =
//       customerCropPoint +
//       parseFloat(
//         cartDetails.cartItems[i].cropRulesWithBonus *
//           cartDetails.cartItems[i].cartQuantity
//       );
//     console.log("product id", cartDetails.cartItems[i]._id);
//     console.log("business id", cartDetails.cartItems[i]?.user);
//     const user = cartDetails.cartItems[i]?.user;
//     console.log("finding customer");
//     const findBusiness = await business.findOne({ _id: user });
//     if (findBusiness) {
//       let cropPoint =
//         findBusiness.croppoint -
//         cartDetails.cartItems[i].cartQuantity *
//           cartDetails.cartItems[i].cropRulesWithBonus;
//       await business.findByIdAndUpdate(
//         { _id: findBusiness._id },
//         { $set: { croppoint: cropPoint } },
//         { new: true }
//       );
//     }
//     const savePaymentAndNotification = async () => {
//       await invoiceAndPaymentNotification.create({
//         type: "Order Notification for purchase",
//         desc: "your product has been purchase",
//         businessId: cartDetails.cartItems[i]._id,
//         payment: {
//           transactionId: findOneRecord.payment_intent,
//         },
//         purchaseOrder: {
//           orderId: findOneRecord._id,
//         },
//       });
//       console.log("payment notification created");
//     };
//     savePaymentAndNotification();
//   }
//   let customer = cartDetails.user_id;
//   let customerCart = cartDetails.id;
//   console.log("finding customer");
//   console.log(customer);
//   let findOneCustomer = await User.findOne({ _id: customer });
//   // let findOneCustomer = await User.findOne({ _id: customer });
//   if (findOneCustomer) {
//     let customerNewCropPoint =
//       findOneCustomer.croppoints + customerCropPoint;
//     await User.findByIdAndUpdate(
//       { _id: findOneCustomer._id },
//       { $set: { croppoints: customerNewCropPoint } },
//       { new: true }
//     );
//     SaveMyCropTrasaction(
//       19.99,
//       19.99,
//       "credit",
//       findOneRecord.payment_intent,
//       findOneRecord.cartDetails.user_id
//     );
//   }



//   // console.log(cropPoint);
//   // console.log("userid", cartDetails.user_id);
//   // console.log("cartId", cartDetails.id);

//   break;
// }