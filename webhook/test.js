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