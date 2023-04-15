
const stripe = require('stripe')('sk_test_51MwJdKSApB6j81bQ7hzzHcLjuKBmW9TpvvosSuVdjS3aHHGTdU4vsVHAVwZ32U7WaRjFOzKjo3vio20tJpVUJbql00LF0fHzxz');
const paymentInfo = async (req, res) => {
  return res.send("hello");  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // amount in cents
      currency: "usd",
    });
    // console.log(paymentIntent)
    const paymentLink = await stripe.paymentLinks.create({
      // payment_intent: paymentIntent.id,
      line_items: [{price: '1000', quantity: 1}],
      // add any other relevant information here
    });
    console.log(paymentLink.url);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { paymentInfo };



