const cart = require('./webhook/cart.json')
let {cartDetails} = cart
let cropPoint = 0;
for(let i=0; i<cartDetails.cartItems.length; i++){
  cropPoint+=parseFloat(cartDetails.cartItems[i].cropRulesWithBonus)
  console.log('product id', cartDetails.cartItems[i]._id )
  console.log('business id', cartDetails.cartItems[i].services.businessId )
}
console.log(cropPoint);
console.log("userid", cartDetails.user_id)
console.log("cartId", cartDetails.id)