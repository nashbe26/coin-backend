const express = require('express');
const { authorize, SUPER_ADMIN, LOGGED_USER } = require('../middleware/jwt.auth');

const userController = require('../controller/user.controller');
const { validateUpdate } = require('../middleware/user.middleware');
const { uploadImages } = require('../utils/multer');

const router = express.Router();


router.param('userId', userController.load);

router.get('/get-all-User',authorize(SUPER_ADMIN),userController.getAllUser);
router.get('/get-one-User',authorize(LOGGED_USER),userController.getOneUser);
router.put('/modify-user',authorize([LOGGED_USER,SUPER_ADMIN]),userController.updateUser);
router.put('/modify-user-livraison',authorize([LOGGED_USER,SUPER_ADMIN]),userController.updateUserLivraison);
router.get('/get-user',authorize([LOGGED_USER,SUPER_ADMIN]),userController.loggedIn);
router.post('/update-user-photo',authorize([LOGGED_USER,SUPER_ADMIN]),uploadImages,userController.updatePhoto);
router.delete('/delete-user/:ids',authorize(SUPER_ADMIN),userController.deleteUser);
router.put('/add-prod-to-fav',authorize([LOGGED_USER,SUPER_ADMIN]),  userController.addToFav);
router.put('/delete-prod-to-fav',authorize([LOGGED_USER,SUPER_ADMIN]),  userController.deleteToFav);
router.put('/udpate-password',authorize(LOGGED_USER),  userController.updatePasswordUser);
router.put('/follow',authorize(LOGGED_USER),  userController.followUser);
router.put('/unfollow',authorize(LOGGED_USER),  userController.unfollowUser);
router.put('/isFollowing',authorize(LOGGED_USER),  userController.isFollowing);


module.exports = router;

