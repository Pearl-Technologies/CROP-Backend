const mongoose = require("mongoose")
const CitySchema = mongoose.model("cities", {
  id: { type: Number },
  name: { type: String },
  stateId: { type: Number },
})

module.exports = CitySchema
