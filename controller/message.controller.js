const Message = require("../models/message");
const Discussion = require("../models/disccusion");

async function createMessage(req, res) {
  try {
    const getDis = await Discussion.findById(req.body.discussionId);

    if (!getDis) return new Error("Failed to get discussion");
        
    getDis.seen = false;

    await getDis.save();

    const newMessage = new Message({
      sender: req.user.user._id,
      content: req.body.content,
      discussion: req.body.discussionId,
      UserType: UserType,
    });

    getDis.messages.push(newMessage._id);
    await getDis.save();
    const savedMessage = await newMessage.save();
    return res.status(200).json({ savedMessage });
  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(404).json({ msg: "Failed to create Message" });
  }
}
async function makeSeen(req, res) {
  try {
    let _id = req.user.user;

    const discussions = await Discussion.find({
      $or: [{ user: _id }, { company: _id }],
    }).populate('messages')

    discussions.map(x=>{
      x.messages.filter(dis => dis.seen == false).map(async x =>{
        x.seen = true;
        await x.save()
      })
      console.log(x);
    })
    return discussions;

  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(404).json({ msg: "Failed to create Message" });
  }
}
async function getMessagesInDiscussion(req, res) {
  try {
    const messages = await Message.find({
      discussion: req.params.discId,
    }).populate("sender");
    return res.status(200).json({ messages });
  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(404).json({ msg: "Failed to get Disccusion" });
  }
}

async function deleteMessage(messageId) {
  try {
    const deletedMessage = await Message.findByIdAndDelete(
      req.params.messageId
    );
    return res.status(200).json({ deletedMessage });
  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(404).json({ msg: "Failed to delete Disccusion" });
  }
}

module.exports = {
  createMessage,
  getMessagesInDiscussion,
  deleteMessage,
  makeSeen
};
