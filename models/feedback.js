const mongoose = require("mongoose");

const DiscussionSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }, 
        text:{
            type:String
        },
        note:{

        },
        prod_id :{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' // Replace 'Product' with the correct model name for favorite products
          },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Feedback", DiscussionSchema);
