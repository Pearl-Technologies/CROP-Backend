const axios = require("axios")

const smsOTP = async (mobile) => {
  console.log(mobile)
  const url = "https://cellcast.com.au/api/v3/send-sms"
  const headers = {
    "Content-Type": "application/json",
    APPKEY: "CELLCAST38f2ad77666863f413da970180dcb7cb",
  }
  try {
    const data = {
      sms_text: "CROP Registration OTP",
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

module.exports = { smsOTP }
