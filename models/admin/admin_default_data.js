const mongoose = require("mongoose");
const  adminDefaultData= mongoose.model("admin_default_data", {
sector:{type:Array, default:['dine', 'shop', 'hotel', 'fual']},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin_user",
  },
  createAt: { type: Date, default: Date.now }

});

module.exports = adminDefaultData;
