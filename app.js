const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const strategies = require('./config/passport');
const GoogleStrategy = require('passport-google-oidc');
const FacebookStrategy = require('passport-facebook');

dotenv.config();

// nodemailer = require ('nodemailer');
//const { google }   = require ('googleapis');
//const OAuth2  = google.auth.OAuth2 ; 
const mongoose = require('./config/dbConnect');

mongoose.connect();

// index routes
const indexRouter = require('./routes/index');

const app = express();

// Connect to mongodb
const session = require('express-session');
const { facebookLogin } = require('./controller/auth.controller');

app.use(session({
	secret: 'bA2xcjpf8y5aSUFsNB2qN5yymUBSs6es3qHoFpGkec75RCeBb8cpKauGefw5qy4',
	resave: true,
	saveUninitialized: true,
  }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public",express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);

app.use(passport.initialize());

passport.use('jwt', strategies.jwt);

passport.use(new GoogleStrategy({
	clientID: '346052481883-tlgna5t0bm9pquhvs0rvd3bi0u2qr5ui.apps.googleusercontent.com',
	clientSecret: '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',
	callbackURL: 'http://localhost:3010/api/v1/auth/google/result',
	scope: [ 'profile' ]
  }, function verify(issuer, profile, cb) {
	console.log(profile);
	return cb(null, profile);
  }));
  
  passport.use(new FacebookStrategy({
	clientID: '896491195403918',
	clientSecret: '24f3aab15fd4ac7d99a8c87e62600ea0',
	callbackURL: 'https://5b52-41-231-230-26.ngrok-free.app/api/v1/auth/facebook/result',
	state: true

  },function verify(accessToken, refreshToken, profile, cb) {
	return cb(null, profile,accessToken);
  }));
  
  
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
 	 console.log(err);
	// render the error page
	res.status(err.status || 500).json({ message: err.message });
});



module.exports = app;




