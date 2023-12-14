const express = require("express");
const router = express.Router();
const FeedbackController = require("../controller/feedback.controller");
const { LOGGED_USER, authorize } = require("../middleware/jwt.auth");

router.post("/createFeedBack",authorize(LOGGED_USER), FeedbackController.createFeedback);
router.get("/getByIdBackByUser",authorize(LOGGED_USER), FeedbackController.getFeedbackByUser);



module.exports = router;
