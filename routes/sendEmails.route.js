const router = require("express").Router();

const { sendVerificationEmailsController } = require("../controller/email.controller");
const { LOGGED_USER, authorize } = require("../middleware/jwt.auth");


router.post("/verfication/send",authorize([LOGGED_USER]),  sendVerificationEmailsController);

module.exports = router;
