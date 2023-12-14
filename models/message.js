const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "User",
    },
    content: {
      type: String,
    },
    seen:{
      type:Boolean,
      default:false
    },
    discussion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", MessageSchema);
