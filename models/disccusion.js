const mongoose = require("mongoose");

const DiscussionSchema = new mongoose.Schema(
    {
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        messages: [
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User', required: true
                },
                text: { type: String, required: true },
                seen:{type:Boolean},
                timestamp: { type: Date, default: Date.now }
            },
        ], 
        prod_id :{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' // Replace 'Product' with the correct model name for favorite products
          },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Discussion", DiscussionSchema);
