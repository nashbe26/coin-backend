
const User = require('../models/user');
const moment = require('moment');
const bcrypt = require('bcrypt');

const dotenv = require('dotenv')
dotenv.config()
const jwt = require('jsonwebtoken');
const { forgotPasswordEmail, sendEmail } = require('../utils/email');

function generateTokenResponse(user, accessToken) {
    const tokenType = 'Bearer';
    const refreshToken = '';
    const expiresIn = moment().add(process.env.JWT_EXPIRATION_MINUTES, 'minutes');
    return {
      tokenType,
      accessToken,
      refreshToken,
      expiresIn
    };
  }

const register = async (req, res,next) => {
    
    // Create a new user instance
    const user = new User(req.body);
  
    // Save the user to the database
    try {
        user.provider = "local";

        let usernameExist = await User.findOne({username:user.username})

        if(usernameExist )
          return res.status(401).json("Nom d'utilisateurs déja existe.");

        const createdUser = await user.save()

        const tokenObject = generateTokenResponse(createdUser, user.token());

        return res.status(200).send(tokenObject);    
    }catch(err){
        return next(User.checkDuplicateEmail(err));
    }

  };

  const login = async (req, res,next) => {
  
    // Create a new user instance
    try{

        const {user,accessToken} = await User.findAndGenerateToken(req.body);
        
        if(!user)
          return res.status(401).json("User not found!");

        const noUser = await User.findById(user._id,{password:0})
        
        const token = generateTokenResponse(noUser, accessToken);

        return res.status(200).json({data:noUser,token})

    }catch(err){
        console.log(err);
        return res.status(401).json({err})
    }   

  };

  const loginAdmin = async (req, res,next) => {
  
    // Create a new user instance
    try{

        const {user,accessToken} = await User.findAndGenerateToken(req.body);
        console.log(user.role,user.role != "superadmin"  );
        let admin = "superadmin"
        if(user.role != "superadmin" ){
          return res.status(401).json("You Are Not Allowed !!");
        }

        const {email} = user
        const token = generateTokenResponse(user, accessToken);

        return res.status(200).json({data:user,token})

    }catch(err){
        console.log(err);
        return res.status(401).json({err})
    }   

  };

  const facebookLogin = async (req,res) => {
  
    // Create a new user instance
    try{

        const {id,displayName,email,picture} = req.body.data;

        let user = await User.findOne({email})

        if(user){
          const playload = {
            exp: moment().add(process.env.JWT_EXPIRATION_MINUTES, 'minutes').unix(),
            iat: moment().unix(),
            sub: user._id
          };
          let token = jwt.sign(playload, process.env.JWT_SECRET);
         return res.status(200).json({data:user,token})
        }
        else{

          let newUser= {
            name:displayName,
            provider:"facebook",
            facebookAuth:{
              id:id
            },
            email,
            picture:picture.data.url
          }

          let created = new User(newUser);

          let newData = await created.save();

          if(!newData){
           return res.status(401).json('error')
          }

          const playload = {
            exp: moment().add(process.env.JWT_EXPIRATION_MINUTES, 'minutes').unix(),
            iat: moment().unix(),
            sub: newData._id
          };
          let token = jwt.sign(playload, process.env.JWT_SECRET);
         return res.status(200).json({data:newData,token})

        }

    }catch(err){
        console.log(err);
        return res.status(500).json({msg:'failed to load data'})
    }   

  };
  const recoveryJWT = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_RESET_ACCOUNT, {
      expiresIn: process.env.JWT_RESET_ACCOUNT_DURATION,
    });
  };
  const forgetAccount = async (req,res) => {
    try{
    let email = req.body.email

    console.log(email);
  
    if (!email)  return res.status(401).json(`Email est manquant`);
    const user = await User.findOne({ email: email.toLowerCase() });
  
    if (!user)
       return res.status(401).json(`Aucun compte avec cet e-mail`);
  
      const token = recoveryJWT(user);
      user.recovery_token = token;
      const updateUser = await user.save();
      sendEmail(forgotPasswordEmail(updateUser));
      return res.status(200).json({data:user,token})
    }catch(err){
      console.log(err);
      return res.status(401).json({err})
  }   
    };
  
  const resetAccount = async (req,res) => {
    try{
    let data = req.body

    if (!data.password && !data.token)
      return res.status(401).json(`Mot de passe ou recovery token est manquant`);

    let user = await User.findOne({ recovery_token: data.token });
    if (!user) return res.status(401).json("Token est invalide");
    const hash = bcrypt.hashSync(data.password, 10);
  
    let oneUser = await User.findOneAndUpdate(
      {recovery_token: data.token  },
      { password: hash,
        ecovery_token:null
      },
      {
        returnOriginal: false,
      }
    );

    return res.status(200).json({data:oneUser})
    }catch(err){
        console.log(err);
        return res.status(401).json({err})
    }   

  
  };
  module.exports = {
    register,
    login,
    loginAdmin,
    facebookLogin,
    forgetAccount,
  resetAccount
  }