const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["favoris","offre", "comment_job","submit_job","end_job","achat"],
      required: true,
    },
    id_owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    id_receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
    is_checked: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);