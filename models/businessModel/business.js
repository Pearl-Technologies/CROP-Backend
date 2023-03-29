const mongoose = require("mongoose");
const business = mongoose.model('Business', { 
    ownerName:{
        title:{type:String, required:true},
        fName:{type:String, required:true},
        mName:{
            type:String,
            default:""
        },
        lName:{
            type:String,
            default:""
        },
    },
    // Sridhar Start
    // businessName: {type: String},
    natureOfBusiness: {type: String},
    brandLogo: {type: String},
    nameOfLoyaltyProgram: {type: String},
    activeloyaltyProgram: {type: String},
    program: {type: String},
    activeOffers: {type: String},
    offerRatings: {type: String},
    auditTrail: [{
        updatedDate: {type: Date},
        msg: {type: String}
    }],
    // Sridhar End
    mobileNumber: {type:Number, unique:true },
    email: {type:String, unique:true},
    businessId:{
        ABN:{type:String, default:""},
        ACN:{type:String, default:""},
        BusinessName:{type:String, required:true},
    },
    status:{type:String, default:"active"},
    outletCount:{type:Number, default:1},
    address:{type:Array, default: null},
    mktNotification:{type:Boolean, default:false},
    smsNotification:{type:Boolean, default:false},
    emailNotification:{type:Boolean, default:false},
    newsLetterSubscription:{type:Boolean, default:false},
    notification:{type:Boolean, default:true},
    password:{type:String, required:true},
    avatar:{type:String, default:""},
    cropId:{type:String, required:true, unique:true},
    propId:{type:String, required:true, unique:true},
    Tier:{type:String, default:"base"},
    deliveryServices:{type:String, default:"pickup"},
    promocode:{type:String, default:""},
    refferalCode:{type:String, unique:true, require:true},
    signUpDate:{type:Date, default: Date.now},
    TierChangeDate:{type:Date, default: Date.now},
    lastUpdatedDate:{type:Date, default: Date.now},
    terms:{type:Boolean, required:true},
    bio:{type:Boolean, default:false},
    transctionInterface:{type:String, default:'online'},
    createdAt:{
        type: Date,
        default: Date.now,
      }
 });


module.exports = business