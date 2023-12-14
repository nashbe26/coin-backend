const express = require("express");
const router = express.Router();
const DiscussionController = require("../controller/discussion.controller");
const { LOGGED_USER, authorize } = require("../middleware/jwt.auth");

router.post("/createDiscussions",authorize(LOGGED_USER), DiscussionController.createDiscussion);
router.post("/createMessage",authorize(LOGGED_USER), DiscussionController.createMessage);
router.get("/makeSeen/:id",authorize(LOGGED_USER), DiscussionController.makeSeen);
router.get("/getMyDiscussions",authorize(LOGGED_USER), DiscussionController.getMyDiscussion);
router.get("/getLastMessage",authorize(LOGGED_USER), DiscussionController.getLastMessage);
router.get("/getDiscussions",authorize(LOGGED_USER), DiscussionController.getDiscussion);
router.put("/setNewOffre",authorize(LOGGED_USER), DiscussionController.setOffreDiscussion);
router.put("/updateOffre",authorize(LOGGED_USER), DiscussionController.changeStatus);
router.get("/updateProdDiscussions",authorize(LOGGED_USER), DiscussionController.updateProdDiscussion);
router.delete(
  "/deleteDiscussions/:discussionId",authorize(LOGGED_USER),
  DiscussionController.deleteDiscussion
);

module.exports = router;
