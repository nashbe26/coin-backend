var express = require('express');
var router = express.Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const contactRoutes = require('./contact.route');
const commandeRoutes = require('./commande.route');
const productRoutes = require('./product.route');
const categoryRoutes = require('./category.route');
const imageRoutes = require('./image.route');
const subcategoryRoutes = require('./sub_category');
const verificationRoutes = require('./sendEmails.route');
const messageRouter = require("./message.route");
const disRouter = require("./discussion.route");
const offreRouter = require("./offre.route");
const notificationRouter = require("./notification.route");
const paimentRouter = require("./paiment");
const feedbackRouter = require("./feedback.route");

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/contact', contactRoutes);
router.use('/commande', commandeRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/sub-category', subcategoryRoutes);
router.use('/email', verificationRoutes);
router.use("/message",  messageRouter);
router.use("/disccusion",  disRouter);
router.use("/offre",  offreRouter);
router.use("/notification",  notificationRouter);
router.use("/paiment",  paimentRouter);
router.use("/feedback",  feedbackRouter);

module.exports = router;
