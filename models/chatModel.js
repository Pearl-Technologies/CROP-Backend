const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    text: { type: String },
    foreignKey:{type:String},
    optionRadio: [{
      actual: { type: String},
      forRespond: { type: String },
      // returnActionVal: { type: Boolean },
      // actionValue: { type: String }
    }],
    optionSelect: [{
      actual: { type: String},
      forRespond: { type: String },
      // returnActionVal: { type: Boolean },
      // actionValue: { type: String }
    }],
    optInput: { type: Boolean},
    optInputName: { type: String },
    optSelect: { type: Boolean },
    action:{ type: String }
  });

  const Complaint = mongoose.model("chatAnswers",complaintSchema);

  module.exports = Complaint;

