const express = require("express");
const router = express.Router();
const offreController = require("../controller/offre.controller");
const { LOGGED_USER, authorize } = require("../middleware/jwt.auth");


router.post("/setNewOffre",authorize(LOGGED_USER), offreController.setOffreDiscussion);
router.put("/updateOffre",authorize(LOGGED_USER), offreController.changeStatus);
router.get("/findOffreByIds",authorize(LOGGED_USER), offreController.findOffreByUser);

module.exports = router;
