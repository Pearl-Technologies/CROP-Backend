const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'], forceNER: true });
// Adds the utterances and intents for the NLP
manager.addDocument('en', 'goodbye for now', 'greetings.bye');
manager.addDocument('en', 'bye bye take care', 'greetings.bye');
manager.addDocument('en', 'okay see you later', 'greetings.bye');
manager.addDocument('en', 'bye for now', 'greetings.bye');
manager.addDocument('en', 'i must go', 'greetings.bye');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'howdy', 'greetings.hello');

manager.addDocument('en','start','welcome');
manager.addDocument('en','Need help','welcome')

manager.addDocument('en','24289b8b-9a7a-48d7-8fe1-ed7e23543fa2','complaint');
manager.addDocument('en','c3d12fd5-19e3-44b6-8852-30fde8545ed2','issue.croplogin');
manager.addDocument('en','8241fecd-f648-4ece-96d8-58374c6e7097','issue.mobilelogin');
manager.addDocument('en','3634cf75-0d5a-43a0-8515-983fa8c47646','issue.emaillogin')
manager.addDocument('en','f1d663ea-3f8d-4dc4-9b00-a0f6418dc6cd','issue.croploginerr');
manager.addDocument('en','ca0b4d71-ee3e-466e-af8e-0e548f28c803','issue.mobileloginerr')
manager.addDocument('en','24b96328-0cb2-458e-bd9d-ae0a68a0686a','issue.emailloginerr')
manager.addDocument('en','e6901434-ad37-4dff-97b6-1d12616fc326','issue.tempdisabled')
manager.addDocument('en','e3d9c011-e9d6-4ff5-bcc9-9899ad9e6d47','issue.mobiletempdisabled')
manager.addDocument('en','ce0ccb51-e793-44fe-91b8-f6d21f5436d8','issue.emailtempdisabled')
manager.addDocument('en','b42f6af9-16ba-4e0a-ad0b-b2514260346b','issue.accountdeactive')
manager.addDocument('en','bcf59278-48f4-4e04-9e76-acefcd9b501c','issue.mobileaccountdeactive')
manager.addDocument('en','3499f7c8-356b-4c8d-8578-71c91740da11','issue.emailaccountdeactive')
manager.addDocument('en','36f5c654-76b3-48ca-abe4-bef52da62761','issue.cropforgetpinyes');
manager.addDocument('en','4c73259d-a2ce-433e-8108-c53907de6e48','issue.mobileforgetpinyes')
manager.addDocument('en','a8d407c1-8313-45fc-8e60-821dad4de945','issue.emailforgetpinyes')
manager.addDocument('en','92044808-f5db-4166-945b-f1433a274eb9','issue.cropforgetpinno');
manager.addDocument('en','6650eae9-fdbf-4b5a-99ba-46d1a7971746','issue.mobileforgetpinno');
manager.addDocument('en','a0a000b0-b7ee-4c9c-974e-e061a142d4eb','issue.emailforgetpinno')
manager.addDocument('en','10716821-852f-44fd-b163-25161be690f8','loggedrequestyes');
manager.addDocument('en','7712f552-fbd7-4675-836c-635133fe3bfb','mobileloggedrequestyes')
manager.addDocument('en','68dfe3bf-7634-4514-8ec0-8cd0b22b8c58','emailloggedrequestyes')
manager.addDocument('en','8ea96fae-49af-49e7-8afc-663e3a1c8b35','loggedrequestno');
manager.addDocument('en','1092abc5-801d-49b1-8312-a18ae8c60b7e','mobileloggedrequestno')
manager.addDocument('en','bf1ea06b-2fe9-4242-9435-9e207464ccc7','emailloggedrequestno')
manager.addDocument('en','6566cc18-b1c2-492d-8802-efc9bdc9607c','loggedrequestsure');
manager.addDocument('en','a7f5f9d7-6cc8-4df2-9d60-7b167d0a3805','mobileloggedrequestsure')
manager.addDocument('en','c79c5880-4f0e-45cd-8984-9d14c825fa19','emailloggedrequestsure')
manager.addDocument('en','fcb53414-3537-4d89-a70a-918bf309dbed','order.payunable')
manager.addDocument('en','78f976a4-03b9-4fe9-82a4-d9983349fa91','payment.refresh')
manager.addDocument('en','e525151b-fdec-49ea-aa06-79934bdf745e','payment.refreshyes')
manager.addDocument('en','d7317b57-6881-4774-9990-104c46c01b3e','payment.refreshno')
manager.addDocument('en','52cc4c6f-0dfb-47c9-ab6b-7a3118e63390','payment.authenticateError')
manager.addDocument('en','6ec23a1c-8d7d-4dd9-9078-05cfa3bd7000','payment.declined')
manager.addDocument('en','fc2d0d1a-2374-42bc-83fd-8fe91f063b44','payment.OTPissued')
manager.addDocument('en','badd6923-ade7-4abe-b212-fa25cf73e171','payment.systemTimeout')
manager.addDocument('en','c1194f73-1b39-44e2-b5f2-c429e70b2111','payment.evoucher')


manager.addAnswer('en', 'greetings.bye', 'Till next time');
manager.addAnswer('en', 'greetings.bye', 'see you soon!');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Greetings!');

manager.addAnswer('en','welcome',{text:"Please indicate service type",
optionRadio:[
    {actual:"Complaint",forRespond:"24289b8b-9a7a-48d7-8fe1-ed7e23543fa2"},
    {actual:"Request",forRespond:"5beaf986-0907-4f79-bd8f-7e8de39a8089"}
],
optionSelect:[],
optSelect:false});

manager.addAnswer('en','complaint',{text:"Please select nature of complaint",optionRadio:[],
optionSelect:[
        {actual:"Not able to login using CROP number",forRespond:"c3d12fd5-19e3-44b6-8852-30fde8545ed2"},
        {actual:"Not able to login using Mobile number",forRespond:"8241fecd-f648-4ece-96d8-58374c6e7097"},
        {actual:"Not able to login using Email",forRespond:"3634cf75-0d5a-43a0-8515-983fa8c47646"},
        {actual:"Order Confirmed but not able to Pay",forRespond:"fcb53414-3537-4d89-a70a-918bf309dbed"},
        {actual:"Payment made but E-Voucher not received",forRespond:"c1194f73-1b39-44e2-b5f2-c429e70b2111"},
        {actual:"CROPs not credited – Order or Purchase",forRespond:"3a130070-6315-4307-a1b0-e222582051cb"},
        {actual:"Not able to redeem",forRespond:"df26051d-09fb-4f72-b0c0-5e7d99fb53e2"}],
optSelect:false});

manager.addAnswer('en','issue.croplogin',{text:"Please select error message",
optionRadio:[],
optionSelect:[
    {actual:"Login and Pin combination is not correct",forRespond:"f1d663ea-3f8d-4dc4-9b00-a0f6418dc6cd"},
    {actual:"Login temporarily disabled",forRespond:"e6901434-ad37-4dff-97b6-1d12616fc326"},
    {actual:"Membership deactivated",forRespond:"b42f6af9-16ba-4e0a-ad0b-b2514260346b"}],
optSelect:false})

manager.addAnswer('en','issue.mobilelogin',{text:"Please select error message",
optionRadio:[],
optionSelect:[
    {actual:"Login and Pin combination is not correct",forRespond:"ca0b4d71-ee3e-466e-af8e-0e548f28c803"},
    {actual:"Login temporarily disabled",forRespond:"e3d9c011-e9d6-4ff5-bcc9-9899ad9e6d47"},
    {actual:"Membership deactivated",forRespond:"bcf59278-48f4-4e04-9e76-acefcd9b501c"}],
optSelect:false})

manager.addAnswer('en','issue.emaillogin',{text:"Please select error message",
optionRadio:[],
optionSelect:[
    {actual:"Login and Pin combination is not correct",forRespond:"24b96328-0cb2-458e-bd9d-ae0a68a0686a"},
    {actual:"Login temporarily disabled",forRespond:"ce0ccb51-e793-44fe-91b8-f6d21f5436d8"},
    {actual:"Membership deactivated",forRespond:"3499f7c8-356b-4c8d-8578-71c91740da11"}],
optSelect:false})

manager.addAnswer('en','issue.croploginerr',{
    text:"Have you forgotten your Pin?",
    optionRadio:[
        {actual:"Yes",forRespond:"36f5c654-76b3-48ca-abe4-bef52da62761"},
        {actual:"No",forRespond:"92044808-f5db-4166-945b-f1433a274eb9"}
    ],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.mobileloginerr',{
    text:"Have you forgotten your Pin?",
    optionRadio:[
        {actual:"Yes",forRespond:"4c73259d-a2ce-433e-8108-c53907de6e48"},
        {actual:"No",forRespond:"6650eae9-fdbf-4b5a-99ba-46d1a7971746"}
    ],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.emailloginerr',{
    text:"Have you forgotten your Pin?",
    optionRadio:[
        {actual:"Yes",forRespond:"a8d407c1-8313-45fc-8e60-821dad4de945"},
        {actual:"No",forRespond:"a0a000b0-b7ee-4c9c-974e-e061a142d4eb"}
    ],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.cropforgetpinyes',{
    text:"Please Reset your Pin. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.mobileforgetpinyes',{
    text:"Please Reset your Pin. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.emailforgetpinyes',{
    text:"Please Reset your Pin. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.cropforgetpinno',{
    text:"You would need to enter crop number without any space in the Login screen. Can you confirm that your entry is correct and without any space?",
    optionRadio:[
        {actual:"yes",forRespond:"10716821-852f-44fd-b163-25161be690f8"},
        {actual:"No",forRespond:"8ea96fae-49af-49e7-8afc-663e3a1c8b35"},
        {actual:"Sure",forRespond:"6566cc18-b1c2-492d-8802-efc9bdc9607c"},
    ],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.mobileforgetpinno',{
    text:"You would need to enter the Mobile number that was used for sign up. The mobile number should be entered with the prefix ‘0’. Eg. if your mobile number is 123456789 then your entry should be 0123456789 without any space. Can you confirm that your entry is correct and without any space?",
    optionRadio:[
        {actual:"yes",forRespond:"7712f552-fbd7-4675-836c-635133fe3bfb"},
        {actual:"No",forRespond:"1092abc5-801d-49b1-8312-a18ae8c60b7e"},
        {actual:"Sure",forRespond:"a7f5f9d7-6cc8-4df2-9d60-7b167d0a3805"},
    ],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.emailforgetpinno',{
    text:"You would need to enter the Email ID that was used for sign up. Can you confirm that your entry is correct?",
    optionRadio:[
        {actual:"yes",forRespond:"68dfe3bf-7634-4514-8ec0-8cd0b22b8c58"},
        {actual:"No",forRespond:"bf1ea06b-2fe9-4242-9435-9e207464ccc7"},
        {actual:"Sure",forRespond:"c79c5880-4f0e-45cd-8984-9d14c825fa19"},
    ],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','loggedrequestyes',{
    text:"We have lodged a ticket for your complaint. You will receive a notification from us once its resolved. Thank You!",
    optionRadio:[],
    optionRadio:[],
    optSelect:false
})

manager.addAnswer('en','mobileloggedrequestyes',{
    text:"We have lodged a ticket for your complaint. You will receive a notification from us once its resolved. Thank You!",
    optionRadio:[],
    optionRadio:[],
    optSelect:false
})

manager.addAnswer('en','emailloggedrequestyes',{
    text:"We have lodged a ticket for your complaint. You will receive a notification from us once its resolved. Thank You!",
    optionRadio:[],
    optionRadio:[],
    optSelect:false
})

manager.addAnswer('en','loggedrequestno',{
    text:"Please try again. Enter your correct eight-digit CROP number on the Login screen without any space. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','mobileloggedrequestno',{
    text:"Please try again. Enter your correct Mobile number that was used for sign up on the Login screen without any space.",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','emailloggedrequestno',{
    text:"Please try again. Enter your correct Email ID that was used for sign up on the Login screen without any space.",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','loggedrequestsure',{
    text:"Please try again. Enter your correct eight-digit CROP number on the Login screen without any space. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','mobileloggedrequestsure',{
    text:"Please try again. Enter your correct Mobile number that was used for sign up on the Login screen without any space.",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','emailloggedrequestsure',{
    text:"Please try again. Enter your correct Email ID that was used for sign up on the Login screen without any space.",
    optionRadio:[],
    optionSelect:[],
    optSelect:false 
})

manager.addAnswer('en','issue.tempdisabled',{
    text:"Your membership is temporarily disabled. Please refer to our notification and Email communication sent earlier requesting necessary action  at your end. Please act on this Email and send us a line of confirmation for service reinstatement. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.mobiletempdisabled',{
    text:"Your membership is temporarily disabled. Please refer to our notification and Email communication sent earlier requesting necessary action  at your end. Please act on this Email and send us a line of confirmation for service reinstatement. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.emailtempdisabled',{
    text:"Your membership is temporarily disabled. Please refer to our notification and Email communication sent earlier requesting necessary action  at your end. Please act on this Email and send us a line of confirmation for service reinstatement. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.accountdeactive',{
    text:"Your membership is discontinued, and you will no longer be able to access our service using your existing login. Please refer to our notification and Email communication sent earlier requesting necessary action  at your end. Please act on this Email and send us a line of confirmation. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.mobileaccountdeactive',{
    text:"Your membership is discontinued, and you will no longer be able to access our service using your existing login. Please refer to our notification and Email communication sent earlier requesting necessary action  at your end. Please act on this Email and send us a line of confirmation. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','issue.emailaccountdeactive',{
    text:"Your membership is discontinued, and you will no longer be able to access our service using your existing login. Please refer to our notification and Email communication sent earlier requesting necessary action  at your end. Please act on this Email and send us a line of confirmation. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','order.payunable',{
    text:"Please select the error type",
    optionRadio:[],
    optionSelect:[
        {actual:"Screen not refreshing to payment page",forRespond:"78f976a4-03b9-4fe9-82a4-d9983349fa91"},
        {actual:"Payment authentication error",forRespond:"52cc4c6f-0dfb-47c9-ab6b-7a3118e63390"},
        {actual:"Payment declined",forRespond:"6ec23a1c-8d7d-4dd9-9078-05cfa3bd7000"},
        {actual:"OTP not received",forRespond:"fc2d0d1a-2374-42bc-83fd-8fe91f063b44"},
        {actual:"system timed out",forRespond:"badd6923-ade7-4abe-b212-fa25cf73e171"}
    ],
    optSelect:false
})

manager.addAnswer('en','payment.refresh',{
    text:"Have you selected Proceed to Pay on your confirm order screen?",
    optionRadio:[
        {actual:"Yes",forRespond:"e525151b-fdec-49ea-aa06-79934bdf745e"},
        {actual:"No",forRespond:"d7317b57-6881-4774-9990-104c46c01b3e"}
    ],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','payment.refreshyes',{
    text:"We would request you to refresh the screen and try again. If still not resolved, please place a new order. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','payment.refreshno',{
    text:"Please select Proceed to Pay on confirm order screen to move ahead to the payment screen. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','payment.authenticateError',{
    text:"Please reverify the card details entered. If the problem still persist, contact your bank or payment partner for a resolution. Use an alternate payment option for the time being. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','payment.declined',{
    text:"Please reverify the card details entered. If the problem still persist, contact your bank or payment partner for a resolution. Use an alternate payment option for the time being. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','payment.OTPissued',{
    text:"Please verify your mobile number and/or Email ID with your bank or payment partner. Use an alternate payment option for the time being. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

manager.addAnswer('en','payment.systemTimeout',{
    text:"Please reattempt the transaction. You would need to complete the transaction within the time limit displayed. Thank You!",
    optionRadio:[],
    optionSelect:[],
    optSelect:false
})

const chatControl = async (req, res) => {
  try {
    let { query } = req.body;
    await manager.train();
    manager.save();
    const response = await manager.process('en',query);
    console.log(response)
    console.log('Response:', response.answer);
    res.send(response.answer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = chatControl;
