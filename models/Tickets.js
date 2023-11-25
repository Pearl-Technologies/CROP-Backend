const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_customers",
    },
    actionId:{
        type: String,
        required: true,
      },
    issueData: {
        type:Object
    },
    issueText:{type:String},
    action: {
      type: String,
      required: true,
    },
    isSolved:{type:Boolean,default:false},
    issueId: {
      type: String,
      required: true,
    },
  });

  const TicketModel = mongoose.model("Tickets",TicketSchema);

  module.exports=TicketModel;