const Feedback = require("../models/feedback");
const mongoose = require("mongoose");

const createFeedback = async (req,res) =>{
    try{
        
        let newFeed = new Feedback(req.body)
        let feed = await newFeed.save()

        return res.status(200).json({feedback:feed})

    }catch(err){
        return res.status(500).json("failed to create feedback")
    }
}

const getFeedbackByUser = async (req,res) =>{
    try{
        let owner = req.params.owner;

        const allFedd = await Feedback.find({
            recevier:owner
        }).populate('owner receiver prod_id')


        return res.status(200).json({feedback:allFedd})
    }catch(err){
        
    }
}

module.exports = {
    createFeedback,
    getFeedbackByUser
}