const businessAccountNotification = require("../../../models/admin/notification/businessAccountNotification");

const createBusinessAccountNotification = async (req, res) => {
  try {
    const {
        first_time_subscription,
        subscription_renewal,
        points_transaction ,
        sales ,
        point_offered_against_spends,
        point_offered_surveys_completed,
        point_Offered_social_media,
        base_threshold_limit,
        pin_change,
        program_change_Offer_points,
        program_change_redemption ,
        program_change_bonus_points,
        program_change_slash_redeemption_changes,
        transfer_out,
        statement_generation,    
        user,
    } = req.body;
    const findRecord = await businessAccountNotification.find({});
    if(findRecord.length){
        return res.status(400).send("record is already exist");
    }
    await businessAccountNotification.create({
        first_time_subscription,
        subscription_renewal,
        points_transaction ,
        sales ,
        point_offered_against_spends,
        point_offered_surveys_completed,
        point_Offered_social_media,
        base_threshold_limit,
        pin_change,
        program_change_Offer_points,
        program_change_redemption ,
        program_change_bonus_points,
        program_change_slash_redeemption_changes,
        transfer_out,
        statement_generation,    
        user,
    });
    res.status(200).send("created");
  } catch (error) {
    console.log(error.message)
    return res.status(500).send("interal error")
  }
};
const getBusinessAccountNotification = async (req, res) => {
    try {
      const notification = await businessAccountNotification.find({})
      res.status(200).json({notification});
    } catch (error) {
      console.log(error.message)
      return res.status(500).send("interal error")
    }
  };

  const updateBusinessAccountNotification = async (req, res) => {
    try {
        const {
            first_time_subscription,
            subscription_renewal,
            points_transaction ,
            sales ,
            point_offered_against_spends,
            point_offered_surveys_completed,
            point_Offered_social_media,
            base_threshold_limit,
            pin_change,
            program_change_Offer_points,
            program_change_redemption ,
            program_change_bonus_points,
            program_change_slash_redeemption_changes,
            transfer_out,
            statement_generation,    
            user,
            _id,
          } = req.body;

    const findRecord = await businessAccountNotification.findOne({_id}); 
          if(!findRecord){
            return res.status(200).send("no record found");
          }
          let newData = {};
          if(first_time_subscription){
            newData.first_time_subscription = first_time_subscription
          }
          if(subscription_renewal){
            newData.subscription_renewal = subscription_renewal
          }
          if(points_transaction){
            newData.points_transaction = points_transaction
          }
          if(sales){
            newData.sales = sales
          }
          if(point_offered_against_spends){
            newData.point_offered_against_spends = point_offered_against_spends
          }
          if(point_offered_surveys_completed){
            newData.point_offered_surveys_completed = point_offered_surveys_completed
          }
          if(point_Offered_social_media){
            newData.point_Offered_social_media = point_Offered_social_media
          }
          if(base_threshold_limit){
            newData.base_threshold_limit = base_threshold_limit
          }
          if(pin_change){
            newData.pin_change = pin_change
          }
          if(program_change_Offer_points){
            newData.program_change_Offer_points = program_change_Offer_points
          }
          if(program_change_redemption){
            newData.program_change_redemption = program_change_redemption
          }
          if(program_change_bonus_points){
            newData.program_change_bonus_points = program_change_bonus_points
          }
          if(program_change_slash_redeemption_changes){
            newData.program_change_slash_redeemption_changes = program_change_slash_redeemption_changes
          }
          if(transfer_out){
            newData.transfer_out = transfer_out
          }
          if(statement_generation){
            newData.statement_generation = statement_generation
          }
          if(findRecord.user.toString() !== user){
            return res.status(400).send("you are not authorize");
          }
          await businessAccountNotification.findByIdAndUpdate({_id}, {$set:newData}, {new:true})
          res.status(200).send("updated");
        } catch (error) {
      console.log(error.message)
      return res.status(500).send("interal error")
    }
  };

module.exports = { createBusinessAccountNotification, getBusinessAccountNotification, updateBusinessAccountNotification };
