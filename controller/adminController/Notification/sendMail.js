const { sendEmail } = require("../../../config/email");
const {User} = require('../../../models/User')
const business = require('../../../models/businessModel/business')
const sendMail = (req, res) => {
  const mailData = {
    from: process.env.EMAIL_USER,
    to: `${"pradeepswain2165@gmail.com"}`,
    subject: "Email Activation",
    subject: "Verify Your Email",
    html: `<h2>Hello ${"pradeep"}</h2>
        <p>Verify your email address to complete the signup and login into your <strong>CROP</strong> account.</p>
    
          <p>This link will expire in <strong> 15 minute</strong>.</p>
    
          <p style="margin-bottom:20px;">Click this link for active your account</p>
    
          <a href="${
            process.env.STORE_URL
          }/email-verify" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none; cursor:"pointer">Verify Account</a>
    
          <p style="margin-bottom:0px;">Thank you</p>
          <strong>Hamart Team</strong>
           `,
  };
  const message = "Notification sent";
  sendEmail(mailData, res, message);
};
const sendMassNotification = async (req, res) => {
  const { sms, app, email, businessNotificationContent, emailData, customerNotificationContent, userEmailData } = req.body;
  // console.log(req.body)
  try {
    if(email && customerNotificationContent){
      for (let i = 0; i < userEmailData.length; i++) {
        console.log(userEmailData[i]);
        // const mailData = {
        //   from: process.env.EMAIL_USER,
        //   to: `${userEmailData[i]}`,
        //   subject: "Mass notification",
        //   // html: `<h2>Hello ${emailData[i].slice(0, emailData[i].indexOf("@"))}</h2>  
        //   html: `<h2>Hello Hello ${emailData[i].slice(0, emailData[i].indexOf("@"))}</h2> 
        //   <p>${customerNotificationContent}</p>
        //   <p>
        //   thank you
        //   <br>
        //   CROP TEAM
        //   </p>
        //      `,
        // };
        // const message = "message sent successfully!";
        // sendEmail(mailData, res, message);
      }
    }
    if(email && businessNotificationContent){
      for (let i = 0; i < emailData.length; i++) {
        console.log(emailData[i]);
        // const mailData = {
        //   from: process.env.EMAIL_USER,
        //   to: `${userEmailData[i]}`,
        //   subject: "Mass notification",
        //   // html: `<h2>Hello ${emailData[i].slice(0, emailData[i].indexOf("@"))}</h2>  
        //   html: `<h2>Hello Hello ${emailData[i].slice(0, emailData[i].indexOf("@"))}</h2> 
        //   <p>${customerNotificationContent}</p>
        //   <p>
        //   thank you
        //   <br>
        //   CROP TEAM
        //   </p>
        //      `,
        // };
        // const message = "message sent successfully!";
        // sendEmail(mailData, res, message);
        
      }
    }
    if(sms && customerNotificationContent){
      let numberList = []
      for(let i=0; i< userEmailData.length; i++){
        let fetchedUser = await User.findOne({email:userEmailData[i]}, {mobileNumber:1})
        // console.log(fetchedUser.mobileNumber, "customer user")     
        if(parseInt(fetchedUser.mobileNumber)){
          numberList.push(fetchedUser.mobileNumber)
        }   
      }
      console.log(numberList, "customer")
    }
    if(sms && businessNotificationContent){
      let numberList = []
      for(let i=0; i< emailData.length; i++){
        let fetchedUser = await business.findOne({email:emailData[i]}, {mobile:1}) 
        // console.log(fetchedUser, "business user")    
        if(fetchedUser.mobile){
          numberList.push(fetchedUser.mobile)
        }   
      }
      console.log(numberList, "business")
    }
    res.send("not send")
  } catch (error) {
    console.log(error.message);
    return res.send({msg:"internal error"})
  }
};
module.exports = { sendMail, sendMassNotification };
