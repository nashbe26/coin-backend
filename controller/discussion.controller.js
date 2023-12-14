const Discussion = require("../models/disccusion");
const User = require("../models/user");
const mongoose = require("mongoose");

async function createDiscussion(req, res) {

  try {

    const user = new mongoose.Types.ObjectId(req.query.user);
    let curr = new mongoose.Types.ObjectId(req.route.meta.user._id); 

    const oldDiscussion = await Discussion.findOne({ participants: { $all: [user,curr] } });

    if (oldDiscussion) {
      return res.status(200).json(oldDiscussion);
    }

    const newDiscussion = new Discussion({
      participants:[user,curr] 
    });

    const savedDiscussion = await newDiscussion.save();

    const us = await User.findById(user);
    us.discussions.push(newDiscussion._id);
    await us.save();

    const us_t = await User.findById(user);
    us_t.discussions.push(newDiscussion._id);
    await us_t.save();

    return res.status(200).json(savedDiscussion);

  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "Failed to create Disccusion" });

  }
}

async function getDiscussion(req, res) {
  try {

    let conv_id = new mongoose.Types.ObjectId( req.query.conv_id);

    
    const discussion = await Discussion.findById(
        conv_id
    ).populate('participants prod_id');
    return res.status(200).json({ discussion });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ msg: "Failed to get disccusion" });
  }
}
async function updateProdDiscussion(req, res) {
  try {

    let conv_id = new mongoose.Types.ObjectId( req.query.conv_id);
    let prod_id = new mongoose.Types.ObjectId( req.query.prod_id);

    
    const discussion = await Discussion.findById(
        conv_id
    ).populate('participants');

    discussion.prod_id = prod_id;
    await discussion.save() 

    return res.status(200).json({ discussion });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ msg: "Failed to get disccusion" });
  }
}
async function getMyDiscussion(req, res) {
  try {
    let _id =  req.route.meta.user._id;
    
    const discussions = await Discussion.find(({ participants: { $in: [_id] } }))
      .populate("participants prod_id");

      return res.status(200).json(discussions);
  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(404).json({ msg: "Failed to get disccusion" });
  }
}
async function getMyDiscussion(req, res) {
  try {
    let _id =  req.route.meta.user._id;
    
    const discussions = await Discussion.find(({ participants: { $in: [_id] } }))
      .populate("participants prod_id");

      return res.status(200).json(discussions);
  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(404).json({ msg: "Failed to get disccusion" });
  }
}
async function setOffreDiscussion(req, res) {
  try {
    let _id =  req.route.meta.user._id;
    let dis_id =  req.query.dis_id;
    
    const discussions = await Discussion.findById(dis_id)
      .populate("participants prod_id");
      
      discussions.offre = {
        price:req.body.price,
        status:'pending'
      }

      await discussions.save() 

      return res.status(200).json(discussions);
  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(404).json({ msg: "Failed to get disccusion" });
  }
}

async function changeStatus(req, res) {
  try {
    let _id =  req.route.meta.user._id;
    let dis_id =  req.query.dis_id;
    
    const discussions = await Discussion.findById(dis_id)
      .populate("participants prod_id");
      
      discussions.offre = {
        status:req.body.status
      }

      await discussions.save() 

      return res.status(200).json(discussions);

  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(404).json({ msg: "Failed to get disccusion" });
  }
}

async function getLastMessage(req, res) {
  try {
    let _id =  req.route.meta.user._id;
    
    const discussions = await Discussion.find({ participants: { $in: [_id] } }, { messages: { $slice: -1 } }) .sort({ "messages.timestamp": -1 }).populate("participants prod_id messages.sender")
      return res.status(200).json(discussions);
  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(404).json({ msg: "Failed to get disccusion" });
  }
}

async function makeSeen(req, res) {
  try {
    let _id = req.user.user;
    let {id} = req.params
    // get discution as
    const discussions = await Discussion.findById(
      id
    )

    discussions.messages.map(async x =>{
      x.seen = true;
    })

    await discussions.save()

    return res.status(200).json(discussions);

  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(404).json({ msg: "Failed to create Message" });
  }
}

async function deleteDiscussion(req, res) {
  try {
    const deletedDiscussion = await Discussion.findByIdAndDelete(
      req.discussionId
    );
    return res.status(200).json({ msg: "Disccusion deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ msg: "Failed to delete Disccusion" });
  }
}
async function createMessage(req, res) {
    try {

      const getDis = await Discussion.findById(req.body.discussion_id);
        
      if (!getDis) return new Error("Failed to get discussion");

      const newMessage = {
        sender: req.body.user_id,
        text: req.body.text,
        seen: req.body.seen
      };
    
      getDis.messages.push(newMessage);
      await getDis.save();

      return res.status(200).json({ getDis });

    } catch (error) {
      // Handle error
      console.error(error);
      return res.status(404).json({ msg: "Failed to create Message" });
    }
  }
module.exports = {
  createDiscussion,
  getDiscussion,
  getMyDiscussion,
  deleteDiscussion,
  makeSeen,
  updateProdDiscussion,
  getLastMessage,
  createMessage,
  setOffreDiscussion,
changeStatus
};
