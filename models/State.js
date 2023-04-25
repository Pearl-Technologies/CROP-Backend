const mongoose = require("mongoose")
const StateSchema = mongoose.model("states", {
  id: { type: Number },
  name: { type: String },
})

module.exports = StateSchema
