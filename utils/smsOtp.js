const axios = require("axios")

const smsOTP = async (mobile, otp) => {
  console.log(mobile)
  const url = "https://cellcast.com.au/api/v3/send-sms"
  const headers = {
    "Content-Type": "application/json",
    APPKEY: "CELLCAST38f2ad77666863f413da970180dcb7cb",
  }
  try {
    const date = new Date();
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    const formattedDateTime = date.toLocaleString('en-US', options);
    const data = {
      sms_text: `Your one time email verification code is ${otp}, and is valid for 2 minutes.\n\n(Generated at ${formattedDateTime})\n\n\n***********************\nThis is an auto-generated message. Do not reply to this message.`,
      numbers: [`${mobile}`],
      from: "CROP",
    }
    const smsResponse = await axios.post(url, data, { headers })
    console.log("sms response", smsResponse)
    return smsResponse
  } catch (error) {
    console.log(error)
  }
}
const sendSMS = async (mobile, message) => {
  
  const url = "https://cellcast.com.au/api/v3/send-sms"
  const headers = {
    "Content-Type": "application/json",
    APPKEY: "CELLCAST38f2ad77666863f413da970180dcb7cb",
  }
  try {
    const date = new Date();
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    const formattedDateTime = date.toLocaleString('en-US', options);
    const data = {
      sms_text: `${message}`,
      numbers: [`${mobile}`],
      from: "CROP",
    }
    const smsResponse = await axios.post(url, data, { headers })
    console.log("sms response", smsResponse)
    return smsResponse
  } catch (error) {
    console.log(error)
  }
}

module.exports = { smsOTP, sendSMS }
