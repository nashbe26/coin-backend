const Joi = require('joi');

 const registrationSchema = Joi.object({
  username:Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),


});


 const loginSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6).required(),
});


module.exports = {
    registrationSchema,
    loginSchema
}

