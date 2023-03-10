const express= require('express')
const router = express.Router();
const {Otp}= require("../models/User");
const {User} = require("../models/User");
const {Token} = require("../models/User");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
var shortid = require('shortid');
var fs = require('fs-extra');
const { readFileSync } = require('fs');
const accountSid = "AC31efbb78567dcc30e05243f5193c6da6";
const authToken = "160b8a1bf927b3fb4a71f8a4a7dff449";
const verifySid = "VAd7985f7bf02389316934069629c48aa3";
const client = require("twilio")(accountSid, authToken)
const pathName = process.cwd();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

router.put("/uploadpicture",async(req,res)=>
  {
    try{

    if(fs.existsSync(pathName + '/uploads/' + req.files[0].originalname)) 
    {
        return res.send({message:"File name already Exist"})
    }
    else
    {
    const filesName = fs.createWriteStream(pathName + '/uploads/' + req.files[0].originalname)
    filesName.write(req.files[0].buffer);
    filesName.end();   
    // filesName.on('finish',() => {
    //     return res.status(200).send({message:"File Saved"})
    // })
 //uploading a file in th form where the files stored in th server not in the database
    var obj = pathName + '/uploads/' + req.files[0].originalname;
    console.log(obj)
        let token=req.headers.authorization;
        console.log(token);
        const result= await User.updateOne({"token":token},{$set:{
           avatar:obj
       }});  
       res.status(200).send({message:"Profile pic Updated successfully",
       status:"true",data:[]
      });
    }  
   }catch(err){
      //if any internal error occurs it will show error message
      res.status(500).send({message:"Internal Server error",status:"false",data:[]});
   }    
})

router.get('/',async (req,res)=>{
    return res.status(200).send({message:"API works fine"})
})

router.put('/resendotp',async(req,res) =>{  
    const email=req.body.email;
    var otp=Math.floor(100000 + Math.random() * 900000)

    const transporter = nodemailer.createTransport({
        // service: "Gmail",
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    
    const mailOptions =
     {
        from:"vickystater1@gmail.com",
        to: email,
        subject: "resetted password",
        text:`OTP GENERATED ${otp}`
    }
    
    transporter.sendMail(mailOptions, (err, result) => {
        if (err){
            console.log(err)
            res.status(500).send({message:"Enter the correct email id",status:"false",data:[]});   
        } else{
            res.status(200).send({message:"otp sent successsfully",status:"true",data:[]});       
            const result=  Otp.updateOne({email:email }, {$set: {otp : otp}});          
        }
        })
})

router.post('/emailphone',async(req,res) =>{   

    const phone =req.body.phone;
    const email=req.body.email;

    //Add the status true when the otp is verified in the database

    console.log(phone,email)

    var bool1=0;
    var bool2=0;

    if(email==="")
    {
        bool1=1;
    }
    if(phone==="")
    {
        bool2=1;
    }
     if(bool2===0)
     {
    const phoneExist=await User.findOne({mobileNumber:phone});
    if(phoneExist)
    return res.status(409).send({message:"User with given phone number already exist",status:false})
     }
  if(bool1===0)
  {
    const emailExist=await Otp.findOne({email:email});  
    if(emailExist)
    return res.status(409).send({message:"User with given email already exist",status:false})
  }

 if(email)
 {
  //Email OTP
 var otp=Math.floor(100000 + Math.random() * 900000)

 const transporter = nodemailer.createTransport({
    // service: "Gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const mailOptions =
 {
    from:"vickystater1@gmail.com",
    to: email,
    subject: "resetted password",
    text:`OTP GENERATED ${otp}`
}

transporter.sendMail(mailOptions, (err, result) => {
    if (err){
        console.log(err)
        res.status(500).send({message:"Enter the correct email id",status:"false",data:[]});   
    } else{
        res.status(200).send({message:"otp sent successsfully",status:"true",data:[]});       
        const otpdata = new Otp({
            email:email,
            otp:otp         
         }).save();   
         console.log(otpdata)            
    }
    })
    }
    else
    {
   //Phone OTP
   console.log(phone,"phone")
   client.verify.v2
  .services(verifySid)
  .verifications.create({ to:phone, channel: "sms" })
  .then((verification) =>  {
  console.log(verification);
  res.status(200).send({message:'Otp sent successfully to ur phone number',status:"true",data:[]})
 })
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    })
    }
    })

router.post('/emailphoneverify',async(req,res) =>{

        const otp=req.body.otp; 
        const phone=req.body.phone;
        const email=req.body.email;
        console.log(phone,otp,email);
        if(email==="")
        {
            console.log(phone,otp)
            client.verify.v2
            .services(verifySid)
            .verificationChecks.create({ to: phone, code: otp })
            .then((verification) =>  res.status(200).send({message:'Otp verified successfully',status:"true",data:[]}))
            .catch(()=>res.status(500).send({message:'Enter the correct otp',status:"false",data:[]}))
            .then(() => readline.close());  
        }
        else
        {
            const userData=await Otp.findOne({email:email});
            console.log(userData.otp,otp)
            //if the email id is not present send the error message
            if(userData.otp==otp)
            {
                return res.status(200).send({message:"valid otp",status:"true",data:[]})
            }       
            else
            {
            return res.status(409).send({message:"Invalid otp",status:"false",data:[]})
            }  
     }           
})

router.put('/resetpassword',async(req,res) =>{
   
    const newpin = await bcrypt.hash(req.body.newpin.toString(), 10); 
    let token=req.headers.authorization
    console.log(token)
    let oldpassword=await User.findOne({"token":token})
    console.log(oldpassword)

    if(oldpassword.password===req.body.oldpin)
    {
        return res.status(500).send({message:"Enter the correct old password",status:"false",data:[]})
    }

    if(req.body.oldpin===req.body.newpin)
    {
        return res.status(500).send({message:"Both new and old password are same",status:"false",data:[]})
    }
    const updatedata= await User.updateOne({"token": token }, {$set: {password : newpin}}); 
    if(updatedata)
    {
        res.status(200).send({message:"Pin changed successfully",status:"true"})
    }
    else{
        res.status(500).send({message:"Pin not changed successfully",status:"false"})
    }   
})

router.post('/signup',async (req,res) =>{

    //crop ponis not be static the admin has to decide the point value for referalj

    console.log(req.body)
     try{       
       // checking whether the given mail id is exist in database r not
        const phoneExist=await User.findOne({mobileNumber:req.body.phone});
        const emailExist=await User.findOne({email:req.body.email});
        if(phoneExist)
        return res.status(409).send({message:"User with given phone number already exist"})
        if(emailExist)
        return res.status(409).send({message:"User with given email already exist"})

        //hashing the password
        const hashedPassword = await bcrypt.hash(req.body.password.toString(), 10); 
               
        var promoexist=req.body.promocode;
        if(promoexist)
        {
        const userData=await User.findOne(
            {
                refercode: req.body.promocode         
            });

        if(userData)
            {    
              var promopoints=userData.croppoints+30;  

              const result= await User.updateOne({refercode: req.body.promocode }, {$set: {croppoints : promopoints}}); 
            }   
        }
            //generate unique referid
            const referid=shortid.generate();
            //generate unique crop id             
            var crop= await User.findOne().sort({"cropid":-1}).limit(1);
            var result=crop.cropid
            var cropnumber=result+1;    

            const user = new User({
                name:req.body.name,
                cropid:cropnumber,
                password:hashedPassword,
                mobileNumber:req.body.mobileNumber,
                email:req.body.email,
                UserTitle:req.body.UserTitle,   
                terms:req.body.terms,
                notification:req.body.notification,
                promocode:req.body.promocode, 
                refercode:referid        
            }).save();
       
         "www.railmitra.app/refer?id=123456"
         //saving data in the database
         res.send({message:"Register successfully",
         status:"true",data:{"refercode":referid,"cropid":cropnumber,"croppoints":0}
        });

     }catch(err){
        console.log(err)
        //if any internal error occurs it will show error message
        res.status(500).send({message:"Register error",status:"false",data:[]});
     }    
});

router.post('/promocode',async (req,res) =>{ 
     var promo=req.body.promo;
      console.log(req.body.promo);

      if(promo==="")
      {
        res.status(200).send({message:"promocode available",status:"true"})
      }
    const userData=await User.findOne({refercode: promo});  
    if(userData)
    {
        res.status(200).send({message:"promocode available",status:"true"})
    }
    else
    {
        res.status(500).send({message:"promocode not available",status:"false"})
    }
    })

router.get('/details',async (req,res) =>{      
    try{
            let token=req.headers.authorization;
            console.log(token,"detailstoken");
            const userData=await User.findOne({"token":token});  
            console.log(userData ,"details");
           res.status(200).send({
           status:"true",data:userData
          });
       }
       catch(err){
          //if any internal error occurs it will show error message
          res.status(500).send({message:"Internal Server error",status:"false",data:[]});
       }    
         
    })
   
router.post('/login',async (req,res) =>{
    
    console.log(req.body);
    try{
        //getting email from the database and compare with the given email id
        const userData=await User.findOne({
           email:req.body.email
        });  
        console.log(userData)
        //if the email id is not present send the error message
        if(!userData.email)
        {
        return res.status(409).send({message:"Wrong credentials!",status:false})
        }
        //comparing the password with database password
        const isPasswordValid = await bcrypt.compare(req.body.password, userData.password);

        if(!isPasswordValid)
        {
            return res.status(409).send({message:"given password not exist"})
        }
          //jwt joken is created when the email and password r correct so that it will generate the token for that user(email)
        var userToken =await jwt.sign({email:userData.email},'vigneshraaj');
        //   res.header('token',userToken).json(userToken);
        console.log(userToken)
        console.log("Data",userData)
        const result= await User.updateOne({email : userData.email }, {$set: {token : userToken}});      
        res.status(200).send({token:userToken,message:"Login successfull",status:"true",data:{userData}});

    }catch(err){
        res.status(500).send({message:"Login error",status:"false",data:[]});
    }
})

//after login creating the jwt token for valid user
// const validUser=(req,res,next)=>{
//     var token=req.header('token');
//     req.token=token;
//     next();
// }

router.put('/forget',async(req,res) =>{

             let email=req.body.email;
            try{
                const forgotpassword=await User.findOne({email:email});
        
                if(!forgotpassword)
                {
                    return res.status(409).send({message:"given email not exist"})
                    }                  
                     //updating the password in the database
                    var userEmail = req.body.email;
                    console.log(userEmail);    
                    var otp=Math.floor(100000 + Math.random() * 900000)
                    const result= await Otp.updateOne({email : userEmail }, {$set: {otp : otp}});     
                    console.log(result);     

                    const transporter = nodemailer.createTransport({
                        // service: "Gmail",
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD
                        }
                    });
                    const mailOptions = {
                        from:"vickystater1@gmail.com",
                        to: userEmail,
                        subject: "resetted password",
                        text:`OTP GENERATED ${otp}`
                    }
                    transporter.sendMail(mailOptions, (err, result) => {
                        if (err){
                            console.log(err)
                            res.json('Oops error occurred')
                            res.status(500).send({message:"OTP not sent successfully",status:"false",data:[]});
                        } else{
                           
                            res.status(200).send({message:"we have successfully sent the OTP",status:"true",data:[]});                   
                        }
                    })
                }               
                catch(err){
                    res.status(500).send({message:"Enter the registered mail-id"});
                }
            }
            )

router.put('/forgetpassword',async(req,res) =>{

      let email=req.body.email;
      try{                 
             //updating the password in the database
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const result= await User.updateOne({email:email}, {$set: {password : hashedPassword}});     
            console.log(result);    
            res.status(200).send({message:"Password changed Successfully",status:"true",data:[]});
        }               
        catch(err){
            res.status(500).send({message:"Error Message",status:"false",data:[]});
        }
            })


router.get('/profile',async(req,res) =>{  

    let token=req.headers.authorization
    console.log("token",token);
    var base64;
    try{
        const profile=await User.findOne({"token":token})

        if(profile.avatar===null)
        {       
              base64=null;      
              console.log(base64,"bse")   
        }
        else
        {
            const imageBuffer = fs.readFileSync(profile.avatar)
            base64 = imageBuffer.toString('base64')  
            console.log(base64,"base") 
        }     
       
       var details={
        "name":profile.name,
        "mobileNumber":profile.mobileNumber,
        "Email":profile.email,
        "refercode":profile.referid,
        "dob":profile.dob, 
        "gender":profile.gender, 
        "address":profile.address,
        "agegroup":profile.agegroup,
        "loyaltyList":profile.loyaltyList,
        "interestList":profile.interestList,
        "image":base64

       }
         res.status(200).send({profile:details,
         status:"true",data:[]
        });
     }

 catch(err){
        res.status(500).send({message:"Internal server error",status:"false",data:[]});
     }    
})

router.put('/updateprofile',async(req,res) =>{  

    let token=req.headers.authorization
    const date=req.body.dob;
    console.log(req.body.dob)
    
    try{
          const result= await User.updateOne({"token":token},{$set:{
             name:req.body.name,
             mobileNumber:req.body.mobileNumber,
             email:req.body.email, 
             gender:req.body.gender,
             dob:req.body.dob, 
             address:req.body.address,
             agegroup:req.body.agegroup,
             loyaltyList:req.body.loyaltyList,
             interestList:req.body.interestList
     }});  
         res.send({message:"Updated successfully",
         status:"true",data:[]
        });
     }catch(err){
        //if any internal error occurs it will show error message
        res.status(500).send({message:"Internal Server error",status:"false",data:[]});
     }    
})
router.post('/community',async(req,res)=>{

    console.log(req.body)
    let token=req.headers.authorization
    console.log(token)
    let data=await User.findOne({"token":token})
    console.log(data)

    const updatedata= await User.updateOne({"token": token }, {$set: { mktNotification:req.body.market,
    smsNotification:req.body.sms,
    emailNotification:req.body.email, }}); 
    if(updatedata)
    {
        res.status(200).send({message:"updated successfully",status:"true"})
    }
    else{
        res.status(500).send({message:"Not updated successfully",status:"false"})
    }   

})

router.get('/showcommunity',async(req,res)=>{

    let token=req.headers.authorization
    console.log(token)
    const communitydata=await User.findOne({"token":token})
    if(communitydata)
    {
        res.status(200).send({data:{ 
            "mktNotification":communitydata.mktNotification,
            "smsNotification":communitydata.smsNotification,
            "emailNotification":communitydata.emailNotification, }
            ,status:"true"})
    }
    else
    {
        res.status(500).send({data:"Internal server Error",status:"false"})
    }     
})

router.post('/biometric',async(req,res)=>{

    let token=req.headers.authorization

    const biometricdata=await User.findOne({"token":token})

    const isPasswordValid = await bcrypt.compare(req.body.pin, biometricdata.password);

    // if(terms===false)
    //    {
    //     res.status(500).send({message:"check terms and conditions",status:"false"})
    //    }

        if(!isPasswordValid)
        {
            return res.status(500).send({message:"enter the correct pin"})
            
        }

    const updatebiometric=await User.updateOne({"token": token }, {$set: { biometricterms:req.body.biometric }}); 

    const userdata=await User.findOne({"token":token})
    console.log(userdata)

        if(userdata.biometricterms===true)
        {
            res.status(200).send({message:"Biometric enabled",status:"true"})
        }
        else{
            res.status(200).send({message:"Biometric disabled",status:"true"})
        }   
})

router.get('/biometricterms',async(req,res)=>{

    let token=req.headers.authorization
    const biometricdata=await User.findOne({"token":token})
    if(biometricdata)
    {
        res.status(200).send({data:{"biometricterms":biometricdata.biometricterms},status:"true"})
    }
    else{
        res.status(500).send({message:"Internal server error",status:"false"})
    }   
})

router.post('/feedback',async(req,res)=>{

    let token=req.headers.authorization;
    console.log(token);
    let feedback=req.body.feedback;
    console.log(feedback);

    const updatedata= await User.updateOne({"token": token }, {$set: { feedback:feedback, }}); 
        if(updatedata)
        {
            res.status(200).send({message:"Feedback updated successfully",status:"true"})
        }
        else{
            res.status(500).send({message:"Feedback not updated successfully",status:"false"})
        }   
})

router.put('/levels',async(req,res)=>{

    let token=req.headers.authorization
    console.log(req.headers)
    const points=req.body.croppoints;
    console.log(points,"points");

    //Changing levels according to croppoints5
    if(points===0)
    {
        const updatelevels=await User.updateOne({"token": token }, {$set: { UserTier:"Base" }}); 
        res.send({status:"true"})
        console.log("base");
    }
    else if(points<=30)
    {
        const updatelevels=await User.updateOne({"token": token }, {$set: { UserTier:"Silver" }}); 
        res.send({status:"true"})
        console.log("Silver");
    }
   else if(points<=60)
    {
        const updatelevels=await User.updateOne({"token": token }, {$set: { UserTier:"Gold" }}); 
        res.send({status:"true"})
        console.log("Gold");
    }
    else if(points<=90)
    {
        const updatelevels=await User.updateOne({"token": token }, {$set: { UserTier:"Platinum" }}); 
        res.send({status:"true"})
        console.log("Platinum");
    }
    // else if(points<=2800)
    // {
    //     const updatelevels=await User.updateOne({"token": token }, {$set: { UserTier:"Diamond" }});
    //     res.send({status:"true"})
    else {
        const updatelevels=await User.updateOne({"token": token }, {$set: { UserTier:"Diamond" }});
        res.send({status:"true"})
        console.log("Diamond",token);
      }
})

router.post('/mate',async(req,res)=>{
    let refercode=req.body.refercode;
    let email=req.body.email;
    console.log(refercode,email);

    const userdata=await User.findOne({email:email});

    if(userdata)
    {
        res.status(500).send({message:"The given mail-ID already exist",status:"false"})
    }

    const transporter = nodemailer.createTransport({
        // service: "Gmail",
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const mailOptions = {
        from:"vickystater1@gmail.com",
        to: email,
        subject: "Refer code",
        text:`REFER CODE ${refercode}`
    }
    transporter.sendMail(mailOptions, (err, result) => {
        if (err){
            console.log(err)
            res.json('Oops error occurred')
            res.status(200).send({message:"Mail sent successfully",status:"true",data:[]});
        } else{          
            res.status(500).send({message:"Internal server error",status:"false",data:[]});                   
        }
    })
})

module.exports = router;
  