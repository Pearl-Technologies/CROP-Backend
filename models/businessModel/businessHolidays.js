const mongoose = require("mongoose")

const BusinessHolidaysShcema = mongoose.Schema(
  {
    holidayDate: String,
    holidayName: String,
    state: String,
  },
  {
    timestamps: true,
  }
)

const BusinessHolidays = mongoose.model(
  "business_holidays",
  BusinessHolidaysShcema
)

module.exports = { BusinessHolidays }

//   {
//     "holidayDate": "01/01/2023",
//     "holidayName": "New Year's Day",
//     "state": "Australian Capital Territory"
//   }
