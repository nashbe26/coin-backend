const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notification.controller");
const { authorize, LOGGED_USER } = require("../middleware/jwt.auth");

router.get("/get_my_notifs",authorize(LOGGED_USER), notificationController.getNotifications);
router.post("/create",authorize(LOGGED_USER), notificationController.createNotification);
router.put("/seenNotif",authorize(LOGGED_USER), notificationController.seenNotif);
router.delete(
  "/delete/:notificationId",authorize(LOGGED_USER),
  notificationController.deleteNotification
);

module.exports = router;
