const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('../models/user')
const dotenv = require('dotenv');

dotenv.config();

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
};

const jwt = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub).populate('fav_prod my_prods achete vendu').populate('my_prods.owner').populate('fav_prod.owner').populate('vendu.owner').populate('achete.owner');
    console.log(payload);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    console.log(error);
    return done(error, false);
  }
};


exports.jwt = new jwtStrategy(jwtOptions, jwt);
