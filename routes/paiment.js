

const express = require("express");
const router = express.Router();
const paymentController = require("../controller/payment.controller");
const { authorize, LOGGED_USER } = require("../middleware/jwt.auth");


router.post("/create-payment-intent",authorize(LOGGED_USER), paymentController.chargeStripe);
router.put("/accetped-payment-intent/:id",authorize(LOGGED_USER), paymentController.acceptedPayement);
router.put("/refused-payment-intent/:id",authorize(LOGGED_USER), paymentController.refusedPayement);


module.exports = router;
