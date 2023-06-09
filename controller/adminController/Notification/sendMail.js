const { sendEmail } = require("../../../config/email");
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
const sendMassNotification = (req, res) => {
  const { userEmailData, subject, notificationBody, user } = req.body;
  try {
    for (let i = 0; i < userEmailData.length; i++) {
      console.log(userEmailData[i]);
      const mailData = {
        from: process.env.EMAIL_USER,
        to: `${userEmailData[i]}`,
        subject: subject,
        // html: `<h2>Hello ${emailData[i].slice(0, emailData[i].indexOf("@"))}</h2>  
        html: `<h2>Hello ${user}</h2> 
           `,
      };
      const message = "message sent successfully!";
      sendEmail(mailData, res, message);
      // console.log("hello")
    }
  } catch (error) {
    console.log(error.message);
    return res.send({msg:"internal error"})
  }
};
module.exports = { sendMail, sendMassNotification };
