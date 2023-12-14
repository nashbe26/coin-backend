const express = require("express");
const router = express.Router();
const MessageController = require("../controller/message.controller");
const { LOGGED_USER, authorize } = require("../middleware/jwt.auth");

router.post("/createMessages",authorize(LOGGED_USER), MessageController.createMessage);
router.get("/getMessages/:discId",authorize(LOGGED_USER), MessageController.getMessagesInDiscussion);
router.delete("/delteMssages/:messageId",authorize(LOGGED_USER), MessageController.deleteMessage);
router.post("/makeSeen",authorize(LOGGED_USER), MessageController.makeSeen);

module.exports = router;
