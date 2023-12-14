const mongoose = require("mongoose");

const OffreSchema = new mongoose.Schema(
    {
        prod_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' 
            },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        price: {
            type: String
        },
        status: {
            type: String,
            default: "pending"
        }

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Offre", OffreSchema);
