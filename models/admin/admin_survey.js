const mongoose = require("mongoose");
const adminCustomerSurvey = mongoose.model('admin_customer_survey', { 
    name:{type:String, required:true},
    gender:{type:String, required:true},
    ageGroup:{type:String, required:true},
    currentLocation:{type:String, required:true},
    mobileNumber:{type:Number},
    email:{type:String},
    lpUser:{type:String, default:"no"},
    srpCount:{type:String},
    rating:{type:String, required:true},
    expectations:{
        instant_gratification_and_rewards:String,
        simplicity_and_ease_of_operating:String,
        Omnichannel_experience:String,	
        extensive_range_of_options:String,	
        flexibility_in_usage_of_points:String,
        reminder_services:String,	
        notification_of_offers_and_promotion:String,
        easy_redemption_options:String,	
        referral_programs:String,
        others:String,
        additional_Recommendations:String
    },
    plainArea:{
        Hidden_charges:String,
        expiry_of_points:String,
        absence_of_relevant_information:String,
        multiple_standalone_programs:String,
        carrying_the_loyalty_card:String,
        inconsistent_experience:String,
        spam_Irrelevant_notifications:String,
        low_percentage_of_rewards:String,
        limited_range_of_offers:String,
        others:String
    },   

    date:{type:Date, default:Date.now},
 });
 const adminBusinessSurvey = mongoose.model('admin_business_survey', { 
    businessName:{type:String, required:true},
    natureOfBusiness:{type:String},
    currentLocation:{type:String, required:true},
    mobileNumber:{type:Number},
    email:{type:String},
    olpUser:{type:String, default:"no"},
    lpApp:{type:String},
    rating:{type:String, required:true},
    expectations:{
        repeat_business:String,
        do_it_Yourself_options:String,
        simplicity_and_ease_of_operating:String,	
        business_analytics:String,	
        marketing_strategy:String,
        reminder_services:String,	
        measure_of_customer_satisfaction:String,
        AI_and_automation:String,	
        customer_retention:String,
        others:String,
        additional_Recommendations:String
    },
    plainArea:{
        Highinvestment_low_returns:String,
        transactionalLoyalty_discount_driven:String,
        management_and_maintenance:String,
        integration_with_ePOS_and_other_systems:String,
        lack_of_actionable_insights:String,	
        market_saturation:String,
        unclaimed_Points_liability:String,
        complex_customisation_requirement:String,
        low_member_engagement:String,
        Others:String
    },   

    date:{type:Date, default:Date.now},
 });
 

module.exports = {adminCustomerSurvey, adminBusinessSurvey};