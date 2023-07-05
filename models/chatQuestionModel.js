const mongoose = require("mongoose");

const complaintQuestionSchema = new mongoose.Schema({
    questionText: { type: String },
    foreignKey:{type:mongoose.Schema.Types.ObjectId}
  });

  const ComplaintQues = mongoose.model("chatQuestions",complaintQuestionSchema);

  module.exports = ComplaintQues;

