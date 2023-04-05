const customerAccountNotification = require("../../../models/admin/notification/customerAccountNotification");

const createCustomerAccountNotification = async (req, res) => {
  try {
    const {
      first_time_notification,
      subscription_renewal,
      points_credit_against_spends,
      points_credit_solical_media_posts,
      redeemtion_limit,
      points_expiry,
      points_redeemed,
      pin_change,
      transfer_in,
      user,
    } = req.body;
    const findRecord = await customerAccountNotification.find({});
    if(findRecord.length){
        return res.status(400).send("record is already exist");
    }
    await customerAccountNotification.create({
      first_time_notification,
      subscription_renewal,
      points_credit_against_spends,
      points_credit_solical_media_posts,
      points_expiry,
      points_redeemed,
      redeemtion_limit,
      pin_change,
      transfer_in,
      user,
    });
    res.status(200).send("created");
  } catch (error) {
    console.log(error.message)
    return res.status(500).send("interal error")
  }
};
const getCustomerAccountNotification = async (req, res) => {
    try {
      const notification = await customerAccountNotification.find({})
      res.status(200).json({notification});
    } catch (error) {
      console.log(error.message)
      return res.status(500).send("interal error")
    }
  };

  const updateCustomerAccountNotification = async (req, res) => {
    try {
        const {
            first_time_notification,
            subscription_renewal,
            points_credit_against_spends,
            points_credit_solical_media_posts,
            points_expiry,
            points_redeemed,
            pin_change,
            transfer_in,
            redeemtion_limit,
            user,
            _id,
          } = req.body;

    const findRecord = await customerAccountNotification.findOne({_id}); 
          if(!findRecord){
            return res.status(200).send("no record found");
          }
          let newData = {};
          if(first_time_notification){
            newData.first_time_notification = first_time_notification
          }
          if(subscription_renewal){
            newData.subscription_renewal = subscription_renewal
          }
          if(points_credit_against_spends){
            newData.points_credit_against_spends = points_credit_against_spends
          }
          if(points_credit_solical_media_posts){
            newData.points_credit_solical_media_posts = points_credit_solical_media_posts
          }
          if(points_expiry){
            newData.points_expiry = points_expiry
          }
          if(points_redeemed){
            newData.points_redeemed = points_redeemed
          }
          if(pin_change){
            newData.pin_change = pin_change
          }
          if(transfer_in){
            newData.transfer_in = transfer_in
          }
          if(redeemtion_limit){
            newData.redeemtion_limit = redeemtion_limit
          }
          if(findRecord.user.toString() !== user){
            return res.status(400).send("you are not authorize");
          }
          await customerAccountNotification.findByIdAndUpdate({_id}, {$set:newData}, {new:true})
          res.status(200).send("updated");
        } catch (error) {
      console.log(error.message)
      return res.status(500).send("interal error")
    }
  };

module.exports = { createCustomerAccountNotification, getCustomerAccountNotification, updateCustomerAccountNotification };
