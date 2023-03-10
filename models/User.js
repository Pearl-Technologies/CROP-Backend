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
  cropid:{type:Number,required:true},
  croppoints:{type:Number, default:0},
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
// bioMetricData:{type:Boolean,default:false},
   loyaltyList:{type:Number,default:null},
   interestList:{type:Number,default:null}, 
   dob:{type:Date,default:null},  
   agegroup:{type:String,default:null},
   avatar: {type:String,default:null},
   address:[{address:{
   line1:{type:String},
    line2:{type:String},
   line3:{type:String},
    state:{type:String},
    pin:{type:String}
    }},],
   mktNotification:{type:Boolean, default:true},
   smsNotification:{type:Boolean, default:true},
   emailNotification:{type:Boolean, default:true}, 
   feedback:{type:String,default:null},
//    auditTrail:{
//     startDate:Date,
//     endDate:Date,
//     description:String,
//     status:String,
// },
// likedProduct:Array,
// newsLetterSubscription:String,
// productRated:Object,
// signUpDate:{type:Date, default: Date.now},
// TierChangeDate:Date,
// lastUpdatedDate:Date,                
});

const OtpSchema=new mongoose.Schema({
email:{type:String},
otp:{type:Number}
})
const TokenSchema=new mongoose.Schema({
  token:{type:Object},
  email:{type:String}
  })

//validate password
//sending data to the userRouter file

const User=mongoose.model('user',UserSchema)
const Otp=mongoose.model('otp',OtpSchema)
const Token=mongoose.model('token',OtpSchema)
module.exports = {User,Otp,Token}

