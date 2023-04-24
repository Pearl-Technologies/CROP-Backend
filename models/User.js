const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// const userSchema = mongoose.Schema(
//   {
//     email: {
//       type: String,
//       validate: [validator.isEmail, "Provide a valid Email"],
//       trim: true,
//       lowercase: true,
//       unique: true,
//       required: [true, "Email address is required"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minLength: [6, 'Must be at least 6 character']
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },

//     name: {
//       type: String,
//       required: [true, "Please provide a name"],
//       trim: true,
//       minLength: [3, "Name must be at least 3 characters."],
//       maxLength: [100, "Name is too large"],
//     },
//     // lastName: {
//     //   type: String,
//     //   required: [true, "Please provide a last name"],
//     //   trim: true,
//     //   minLength: [3, "Name must be at least 3 characters."],
//     //   maxLength: [100, "Name is too large"],
//     // },
//     contactNumber: {
//       type: String,
//       validate: [validator.isMobilePhone, "Please provide a valid contact number"],
//     },

//     shippingAddress: String,

//     imageURL: {
//       type: String,
//       validate: [validator.isURL, "Please provide a valid url"],
//     },
//     phone: {
//       type: String,
//       required: false,
//     },
//     address: {
//       type: String,
//       required: false,
//     },
//     bio: {
//       type: String,
//       required: false,
//     },
//     status: {
//       type: String,
//       default: "inactive",
//       enum: ["active", "inactive", "blocked"],
//     },

//     confirmationToken: String,
//     confirmationTokenExpires: Date,

//     passwordChangedAt: Date,
//     passwordResetToken: String,
//     passwordResetExpires: Date,
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.pre("save", function (next) {
//   if (!this.isModified("password")) {
//     //  only run if password is modified, otherwise it will change every time we save the user!
//     return next();
//   }
//   const password = this.password;
//   const hashedPassword = bcrypt.hashSync(password);
//   this.password = hashedPassword;
//   next();
// });
// // comparePassword
// userSchema.methods.comparePassword = function (password, hash) {
//   const isPasswordValid = bcrypt.compareSync(password, hash);
//   return isPasswordValid;
// };
// // generateConfirmationToken
// userSchema.methods.generateConfirmationToken = function () {
//   const token = crypto.randomBytes(32).toString("hex");

//   this.confirmationToken = token;

//   const date = new Date();

//   date.setDate(date.getDate() + 1);
//   this.confirmationTokenExpires = date;

//   return token;
// };

// const User = mongoose.model("User", userSchema);

// module.exports = User;

const UserSchema=new mongoose.Schema({
    
  token:{type:String},
  name: {type:Object,required:true},
  propid:{type:Number,required:true},
  cropid:{type:Number,required:true},
  croppoints:{type:Number, default:0},
  proppoints:{type:Number, default:0},
  password: { type: String, required: true },
  mobileNumber:{type:String,default:null},
  email:{type:String,default:null},
  UserTitle:{type:String, required:true},
  UserTier:{type:String, default:"Base"},
  gender:{type:String,default:null},
  terms:{type:Boolean, default:false},
  biometricterms:{type:Boolean, default:false},
  notification:{type:Boolean, default:false} , 
  promocode:{type:String,default:null},
  refercode:{type:String,required:true}, 
  status:{type:Boolean,required:true, default: true}, 
  login_method:{type:Number,required:true,default:2},        
// bioMetricData:{type:Boolean,default:false},
   loyaltyList:{type:Number,default:null},
   interestList:{type:Number,default:null}, 
   dob:{type:Date,default:null},  
   agegroup:{type:String,default:null},
   avatar: {type:String,default:null},
   address:[{address:{
    _id:mongoose.Types.ObjectId,
    status: {type:Boolean, default:true},
    line1:{type:String},
     line2:{type:String},
    line3:{type:String},
     state:{type:String},
     pin:{type:Number}
     }},],
   mktNotification:{type:Boolean, default:true},
   smsNotification:{type:Boolean, default:true},
   emailNotification:{type:Boolean, default:true}, 
   feedback:{type:String,default:null},
   auditTrail: [{_id:mongoose.Types.ObjectId, message: String, status: Boolean, value: String}],
//    auditTrail:{
//     startDate:Date,
//     endDate:Date,
//     description:String,
//     status:String,
// },
// likedProduct:Array,
// newsLetterSubscription:String,
// productRated:Object,

 signUpDate:{type:String},
 lastUpdatedDate:{type:String},
 TierChangeDate:{type:String}, 
 status: { type: String, default:"active" },               
});

const OtpSchema=new mongoose.Schema({
email:{type:String},
otp:{type:Number}
});

const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type:String,
    required: true
  },
  type:{
    type:Number,
    required: true
  },
  expiration: {type:Date,default:null},
  createdate:{type:Date,default:null}
});

const NewsletterSchema=new mongoose.Schema({
  email:{type:String,required:true},
})

const MissingCropSchema=new mongoose.Schema({
  doi: {type:String, required:true, default:null},
  product_id: [{type: mongoose.Schema.Types.ObjectId, ref:'business_products'}],
  reason: {type:String,required:true}, 
  invoice_id: {type:String, require: true},
  status:{type:Boolean,required:true, default: true},
  action:{type:String,required:true, default: "pending"},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users_customers',
  },
},{
  timestamps: true
});



//validate password
//sending data to the userRouter file

const Newsletter=mongoose.model('Newsletter_customer',NewsletterSchema)
const User=mongoose.model('users_customers',UserSchema)
const Otp=mongoose.model('otps_customer',OtpSchema)
const Token=mongoose.model('token1_customer',tokenSchema)
const MissingCrop = mongoose.model('missing_crop_customer',MissingCropSchema)
module.exports = {User,Otp,Token,Newsletter,MissingCrop}

