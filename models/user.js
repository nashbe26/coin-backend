
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var createError = require('http-errors')

const roles = ['user', 'superadmin'];
const moment = require('moment');

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const connectionTypes = ['local', 'facebook', 'google', 'apple'];


// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
    lowercase: true,
    index: { unique: true }
  },
  photo: {
    type: String
  },
  username: {
    type: String, unique: true,
    lowercase: true,

  },
  history: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Replace 'Product' with the correct model name for favorite products
  }],

    year: {
      type: String,
      maxlength: 128,
    },
    month: {
      type: String,
      maxlength: 128,
    },
    day: {
      type: String,
      maxlength: 128,
    },
    notifications: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification' // Replace 'Product' with the correct model name for favorite products
    }],
  role: {
    type: String,
    enum: roles,
    default: 'user'
  },
  fav_prod: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Replace 'Product' with the correct model name for favorite products
  }],
  my_prods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Replace 'Product' with the correct model name for favorite products
  }],
  discussions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion' // Replace 'Product' with the correct model name for favorite products
  }],
  
  password: {
    type: String,
    minlength: 6,
    maxlength: 128
  },
  firstName: {
    type: String,
    maxlength: 128,
  },
  bio: {
    type: String,
  },
  lastName: {
    type: String,
    maxlength: 128,
  },
  tel: {
    type: String,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
  },
  facebookAuth: {
    id: String,
    accessToken: String,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  googleAuth: {
    id: String,
    accessToken: String,
  },

  appleAuth: {
    id: String,
    accessToken: String,
  },
  provider: {
    type: String,
    enum: connectionTypes, // Use the predefined connection types
    required: true,
  },
  pays:{
    type: String,
    maxlength: 128,
  },
  recovery_token:{
    type: String,
  
  },
  ville:{
    type: String,
    maxlength: 128,
  },
  langue:{
    type: String,
  },
  card_name:{
    type: String,
  },
  card_last:{
    type: String,
  },
  achete:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Replace 'Product' with the correct model name for favorite products
  }],
  vendu:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Replace 'Product' with the correct model name for favorite products
  }],
  transactions:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  card_iban:{
    type: String,
  },
  card_day:{
    type: String,
  },
  card_year:{
    type: String,
  },
  card_month:{
    type: String,
  },
  card_national:{
    type: String,
  },
  livraison:{
    name:{
      type: String,
    },
    add:{
      type: String,
    },
    addFac:{
      type: String,
    },
    ville:{
      type: String,
    },
    postal_code:{
      type: String,
    }
  }
});



userSchema.pre('save', async function save(next) {

  try {
    // modifying password => encrypt it:
    const hash = await bcrypt.hashSync(this.password, 10);
    this.password = hash;
    return next(); // normal save
  } catch (error) {
    return next(error);
  }

});

userSchema.method({
  // query is optional, e.g. to transform data for response but only include certain "fields"


  token() {
    const playload = {
      exp: moment().add(process.env.JWT_EXPIRATION_MINUTES, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id
    };
    return jwt.sign(playload, process.env.JWT_SECRET);
  },

  async passwordMatches(password) {
    console.log(password,"this.password",this.password);
    return bcrypt.compareSync(password, this.password);
  }
});
userSchema.statics = {
  roles,
  checkDuplicateEmail(error) {
    if (error.code === 11000) {
      return createError(
        500,
        'Addresse Email existe déja'
      );
    }
    return error;
  },
  token() {
    const playload = {
      exp: moment().add(process.env.JWT_EXPIRATION_MINUTES, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id
    };
    return jwt.sign(playload, process.env.JWT_SECRET);
  },
  async findAndGenerateToken(options) {

    const { email, password } = options;
    if (!email) {
      throw createError(err.status, err.message)
    }

    const user = await this.findOne({ email }).populate('fav_prod my_prods vendu achete');

    const err = {
      status: 401,
      isPublic: true
    };

    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw createError(err.status, err.message);
  },
  async get(id) {
    try {
      let user;
      console.log(user);
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id).populate('fav_prod my_prods vendu achete').populate('fav_prod.owner').populate('my_prods.owner').populate('vendu.owner').populate('achete.owner').exec();

      }
      if (user) {
        return user;
      }

    } catch (error) {
      throw createError(httpStatus.NOT_FOUND, 'User does not exist')
    }
  },
}

// Create the user model
const User = mongoose.model('User', userSchema);
// Export the user model
module.exports = User;