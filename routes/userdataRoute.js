const express= require('express')
const router = express.Router();
const {Otp}= require("../models/User");
const {User} = require("../models/User");
const {Token} = require("../models/User");
const {Newsletter} = require("../models/User");
var mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
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

    var obj = pathName + '/uploads/' + req.files[0].originalname;
        let token=req.headers.authorization;
        const token_data = await Token.findOne({"token":token});
        const result=await User.updateOne({_id:token_data.user}, {$set:{
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
    const phone=req.body.phone;
    if(email)
    {
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
        from: process.env.EMAIL,
        to: email,
        subject: "resetted password",
        text:`OTP GENERATED ${otp}`
    }
    
    transporter.sendMail(mailOptions,async (err, result) => {
        if (err){
            res.status(500).send({message:"Enter the correct email id",status:"false",data:[]});   
        } else{
            const result=  await Otp.updateOne({email:email }, {$set: {otp : otp,status:false}}); 
            res.status(200).send({message:"otp sent successsfully",status:"true",data:[]});       
                     
        }
        })
    }
    else
    {
        //Phone OTP
        client.verify.v2
       .services(verifySid)
       .verifications.create({ to:phone, channel: "sms" })
       .then((verification) =>  {
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

router.post('/emailphone',async(req,res) =>{   

    const phone =req.body.phone;
    const email=req.body.email;

    //Add the status true when the otp is verified in the database

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
    const emailExist=await User.findOne({email:email});  
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
    from: process.env.EMAIL,
    to: email,
    subject: "resetted password",
    text:`OTP GENERATED ${otp}`
}

transporter.sendMail(mailOptions, async(err, result) => {
    if (err){
        res.status(500).send({message:"Enter the correct email id",status:"false",data:[]});   
    } else{
        res.status(200).send({message:"otp sent successsfully",status:"true",data:[]}); 
        const emailExists=await Otp.findOne({email:email});  
         if(emailExists)
         {
            const result= await Otp.updateOne({email:email }, {$set: {otp : otp, status:false  }});       
         }
         else{
        const otpdata = new Otp({
            email:email,
            otp:otp,
            status:false         
         }).save();     
        }         
    }
    })
    }
    else
    {
   //Phone OTP
   client.verify.v2
  .services(verifySid)
  .verifications.create({ to:phone, channel: "sms" })
  .then((verification) =>  {
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
        if(email==="")
        {
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
            //if the email id is not present send the error message
            if(userData.otp==otp)
            {
                const result= await Otp.updateOne({email:email }, {$set: {status:true }}); 
                
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
    const token = req.headers?.authorization
    const token_data = await Token.findOne({"token":token});
    const oldpassword=await User.findOne({_id:token_data.user});
    console.log(oldpassword)


    if(oldpassword.password===req.body.oldpin)
    {
        return res.status(500).send({message:"Enter the correct old password",status:"false",data:[]})
    }

    if(req.body.oldpin===req.body.newpin)
    {
        return res.status(500).send({message:"Both new and old password are same",status:"false",data:[]})
    }
    const updatedata= await User.updateOne({_id:token_data.user}, {$set: {password : newpin}}); 

    if(updatedata)
    {
        res.status(200).send({message:"Pin changed successfully",status:"true"})
    }
    else{
        res.status(500).send({message:"Pin not changed successfully",status:"false"})
    }   
})

router.post('/signup',async (req,res) =>{

     try{       
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();

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
            var prop= await User.findOne().sort({"propid":-1}).limit(1);
            var result=crop.cropid
            var cropnumber=result+1;  
            
            var results=prop.propid
            var propnumber=results+1; 

            const user = new User({
                name:req.body.name,
                cropid:cropnumber,
                propid:propnumber,
                password:hashedPassword,
                mobileNumber:req.body.mobileNumber,
                email:req.body.email,
                UserTitle:req.body.UserTitle,   
                terms:req.body.terms,
                notification:req.body.notification,
                promocode:req.body.promocode, 
                refercode:referid,
                signUpDate:formattedDate,
                auditTrail: `You have successfully registered your profile on ${formattedDate}`,       
            }).save();
         //saving data in the database
         res.send({message:"Register successfully",
         status:"true",data:{"refercode":referid,"cropid":cropnumber,"croppoints":0,"propid":propnumber,}
        });
     }catch(err){
     
        //if any internal error occurs it will show error message
        res.status(500).send({message:"Register error",status:"false",data:[]});
     }    
});

router.post('/promocode',async (req,res) =>{ 

      var promo=req.body.promo;
      if(promo==="")
      {
        res.status(200).send({message:"promocode available",status:"true"})
      }
      else
      {
    const userData=await User.findOne({refercode: promo});  
    if(userData)
    {
        res.status(200).send({message:"promocode available",status:"true"})
    }
    else
    {
        res.status(500).send({message:"promocode not available",status:"false"})
    }
  }
    })

 router.put('/logout',async(req,res)=>{
        
        try{
            let token=req.headers.authorization;
            const token_data = await Token.findOne({"token":token});
            const oldpassword=await Token.deleteMany({user:token_data.user});
            const result= await User.updateOne({_id:token_data.user}, {$set: {"token" : "null"}});      
           res.status(200).send({ 
           status:"true",message:"Logout successfully"
          });
       }
       catch(err){
          res.status(500).send({message:"Internal Server error",status:"false",data:[]});
       }            
    })
 
    router.get('/tokenCheck',async(req,res)=>{    

        try{
            let token=req.headers.authorization;
            const result= await Token.findOne({"token" : token });      
            if (result){
                res.status(200).send({ 
                    status:"true",message:"Token active"
                   });
            }
            else{
                res.status(500).send({ 
                    status:"false",message:"Token Inactive"
                   });
            }
       }
       catch(err){
          res.status(500).send({message:"Internal Server error",status:"false",data:[]});
       }            
    })
 
 router.get('/details',async (req,res) =>{      

    try{
            let token=req.headers.authorization;
            const token_data = await Token.findOne({"token":token});
            const userData=await User.findOne({_id:token_data.user});  
           res.status(200).send({
            data:userData,
           status:"true"
          });
       }
       catch(err){
          res.status(500).send({message:"Internal Server error",status:"false",data:[]});
       }            
    })

router.post('/login',async (req,res) =>{
    try{
            let cropid=req.body.cropid;
            let phone=req.body.phone;
            let email=req.body.email;
            console.log(email,"email")

        //getting email from the database and compare with the given email id
        
        const userData=await User.findOne({
           email:req.body.email
        });  
        //if the email id is not present send the error message
        if(!userData.email)  
        {
        return res.status(409).send({message:"Wrong credentialssss!",status:false})
        }
    
//        if(phone)
//         {
//         const userData=await User.findOne({
//            mobileNumber:req.body.phone
//         });  
//         //if the email id is not present send the error message
//         if(!userData.mobileNumber)  
//         {
//         return res.status(409).send({message:"Wrong credentials!",status:false})
//         }
//     }

//     if(cropid)
//     {
//     const userData=await User.findOne({
//         cropid:req.body.cropid
//     });  
//     //if the email id is not present send the error message
//     if(!userData.cropid)  
//     {
//     return res.status(409).send({message:"Wrong credentials!",status:false})
//     }
// }
        //comparing the password with database password
        const isPasswordValid = await bcrypt.compare(req.body.password, userData.password);

        if(!isPasswordValid)
        {
            return res.status(409).send({message:"given password not exist"})
        }
        // if(userData.token!=="null")
        // {
        //     return res.status(500).send({message:"You already logged in"})
        // }
          //jwt joken is created when the email and password r correct so that it will generate the token for that user(email)
          var method = 0;
          var userToken
        //   let now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
          let oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
          if(req.body.login_method === 1) {
              method = 1;
              userToken =await jwt.sign({email:userData.email},'CROP@12345', { expiresIn: '1h' });
              await new Token({ user: userData._id, token: userToken, type:method, expiration: oneHourFromNow }).save();
          }
          else {
              method = 2;
              userToken =await jwt.sign({email:userData.email},'CROP@12345');
              await new Token({ user: userData._id, token: userToken, type:method }).save();
          }
        // const result= await User.updateOne({email : userData.email }, {$set: {token : userToken, login_method: method}});      
        res.status(200).send({token:userToken,message:"Login successfull",status:"true",data:{userData}});

    }catch(err){
        res.status(500).send({message:"Login error",status:"false",data:[err]});
    }
})

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
                    var otp=Math.floor(100000 + Math.random() * 900000)
                    const result= await Otp.updateOne({email : userEmail }, {$set: {otp : otp}});         

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
                        from: process.env.EMAIL,
                        to: userEmail,
                        subject: "resetted password",
                        text:`OTP GENERATED ${otp}`
                    }
                    transporter.sendMail(mailOptions, (err, result) => {
                        if (err){
            
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

            res.status(200).send({message:"Password changed Successfully",status:"true",data:[]});
        }               
        catch(err){
            res.status(500).send({message:"Error Message",status:"false",data:[]});
        }
            })


router.get('/profile',async(req,res) =>{  

    try{
        let token=req.headers.authorization
        var base64;
        const token_data = await Token.findOne({"token":token});
        const profile=await User.findOne({_id:token_data.user})
    
        if(profile.avatar===null)
        {       
              base64=null;      
        }
        else
        {
            const imageBuffer = fs.readFileSync(profile.avatar)
            base64 = imageBuffer.toString('base64') 
        }     
             
       var details={
        "name":profile.name,
        "mobileNumber":profile.mobileNumber,
        "Email":profile.email,
        "refercode":profile.refercode,
        "dob":profile.dob, 
        "gender":profile.gender, 
        "address":profile.address,
        "agegroup":profile.agegroup,
        "loyaltyList":profile.loyaltyList,
        "interestList":profile.interestList,
        "image":base64

       }

         res.status(200).json({"profile":details,
         status:"true",data:[]
        });
     }

 catch(err){
        res.status(500).send({message:"Internal server error",status:"false",data:[err]});
     }    
})

router.put('/updateprofile',async(req,res) =>{  

    let token=req.headers.authorization
    const token_data = await Token.findOne({"token":token});
    const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();
    
    try{
          const result= await User.updateOne({_id:token_data.user},{$set:{
             name:req.body.name,
             mobileNumber:req.body.mobileNumber,
             email:req.body.email, 
             gender:req.body.gender,
             dob:req.body.dob,       
             agegroup:req.body.agegroup,
             loyaltyList:req.body.loyaltyList,
             lastUpdatedDate:formattedDate,
             interestList:req.body.interestList,
             auditTrail: `${req.body.name} have successfully updated his profile on ${formattedDate} `,
           
     }, $push: {address: {_id:mongoose.Types.ObjectId(), address:req.body.address}}});  
         res.send({message:"Updated successfully",
         status:"true",data:[]
        });
     }catch(err){

        res.status(500).send({message:"Internal Server error",status:"false",data:[]});
     }    
})
router.post('/community',async(req,res)=>{

    let token=req.headers.authorization
  
    // let data=await User.findOne({"token":token})
    const token_data = await Token.findOne({"token":token});
    const updatedata= await User.updateOne({_id:token_data.user}, {$set: { mktNotification:req.body.market,
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
    const token_data = await Token.findOne({"token":token});
    const communitydata=await User.findOne({_id:token_data.user})
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
    const token_data = await Token.findOne({"token":token});
    const biometricdata=await User.findOne({_id:token_data.user})

    const isPasswordValid = await bcrypt.compare(req.body.pin, biometricdata.password);


        if(!isPasswordValid)
        {
            return res.status(500).send({message:"enter the correct pin"})
            
        }

    const updatebiometric=await User.updateOne({_id:token_data.user}, {$set: { biometricterms:req.body.biometric }}); 

    const userdata=await User.findOne({_id:token_data.user})


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
    const token_data = await Token.findOne({"token":token});
    const biometricdata=await User.findOne({_id:token_data.user})
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
    
    let feedback=req.body.feedback;
    
    const token_data = await Token.findOne({"token":token});

    const updatedata= await User.updateOne({_id:token_data.user}, {$set: { feedback:feedback, }}); 
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

    const points=parseInt(req.body.croppoints);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const token_data = await Token.findOne({"token":token});
    //Changing levels according to croppoints5
    if(points===0)
    {
        const updatelevels=await User.updateOne({_id:token_data.user},
         {$set: { UserTier:"Base" }, $push:{auditTrail:{value: "UserTier", status: true, message:`The usertier changed to Base on ${formattedDate}`}}}); 
        res.send({status:"true"})
        
    }
    else if(points<=30)
    {
        const updatelevels=await User.updateOne({_id:token_data.user}, 
        {$set: { UserTier:"Silver"}, $push:{auditTrail:{value: "UserTier", status: true, message:`The usertier changed to Silver on ${formattedDate}` }}}); 
        res.send({status:"true"})
    
    }
   else if(points<=60)
    {
        const updatelevels=await User.updateOne({_id:token_data.user}, 
        {$set: { UserTier:"Gold" }, $push:{auditTrail:{value: "UserTier", status: true, message:`The usertier changed to Gold on ${formattedDate}`}}}); 
        res.send({status:"true"})
        
    }
    else if(points<=1000)
    {
        const updatelevels=await User.updateOne({_id:token_data.user}, 
        {$set: { UserTier:"Platinum"}, $push:{auditTrail:{value: "UserTier", status: true, message:`The usertier changed to Platinum on ${formattedDate}` }}}); 
        res.send({status:"true"})
     
    }
    // else if(points<=2800)
    // {
    //     const updatelevels=await User.updateOne({_id:token_data.user}, {$set: { UserTier:"Diamond" }});
    //     res.send({status:"true"})
    else {
        const updatelevels=await User.updateOne({_id:token_data.user}, 
        {$set: { UserTier:"Diamond"}, $push:{auditTrail:{_id: new mongoose.Types.ObjectId(), value: "UserTier", status: true, message:`The usertier changed to Diamond on ${formattedDate}` }}});
        res.send({status:"true"})
      
      }
      //comment one the mate website
})
//comment on the page

router.post('/newsletter',async(req,res)=>{
    console.log(req.body.email)
 
    const userdata=await Newsletter.findOne({email:req.body.email});

    if(userdata)
    {
        res.status(200).send({message:"The given mail-ID already exist",status:"false"})
    }

    const user = new Newsletter({   
        email:req.body.email    
    }).save();
    
    res.status(200).send({message:"Your email is added to newsletter",status:"true"})
  
})

router.post('/mate',async(req,res)=>{

    let refercode=req.body.refercode;
    let email=req.body.email;

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
        from: process.env.EMAIL,
        to: email,
        subject: "Refer code",
        text:`REFER CODE ${refercode}`
    }
    transporter.sendMail(mailOptions, (err, result) => {
        if (err){
            res.json('Oops error occurred')
            res.status(200).send({message:"Mail sent successfully", status:"true", data:[]});
        } else{          
            res.status(500).send({message:"Internal server error", status:"false", data:[]});                   
        }
    })
})

router.get('/profileAdmin',async(req,res) =>{  

    try{
        // let token=req.headers.authorization
        // var base64;
        const profile=await User.find().sort({"_id":-1})
         res.status(200).json({"profile":profile,
         status:"true",data:[]
        });
     }

 catch(err){
        res.status(500).send({message:"Internal server error",status:"false",data:[err]});
     }    
})

module.exports = router;