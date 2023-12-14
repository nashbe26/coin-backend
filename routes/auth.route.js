const express = require('express');
const { register, login, loginAdmin, facebookLogin, forgetAccount, resetAccount } = require('../controller/auth.controller');

const { validateUser, validateLogin } = require('../middleware/auth.middleware');

const router = express.Router();

const passport = require('passport');


router.post('/register',validateUser,register);
router.post('/login',validateLogin,login);
router.post('/forgot-account',forgetAccount);
router.post('/reset-account',resetAccount);
router.post('/loginAdmin',validateLogin,loginAdmin);
router.post('/facebook',facebookLogin);

/*router.get('/failed',(req,res)=>{
    console.log(req.body);
});

router.get('/success',(req,res)=>{
    console.log(req.body);
});
router.get('/google/register', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));
  
  router.get('/google/result', passport.authenticate('google', {
    successRedirect: '/api/v1/auth/success',
    failureRedirect: '/api/v1/auth/failed',
    session: false
  }));

router.get('/facebook/register'
, passport.authenticate('facebook', { scope: ['email'] }))   
 
router.get('/facebook/result', passport.authenticate('facebook', { session: false }), async (req, res) => {

  let data =await facebookLogin(req.user,req.authInfo)
  
  if(data)
    return res.status(200).json(data)
  // Redirect to an endpoint with the JWT token

});*/
module.exports = router;