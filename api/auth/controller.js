const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const {
  emailSchema,
  passwordSchema,
} = require("../../validators/formRegister.validator");
const User = require("../../model/userModel");
const { sendMail } = require("../../utils");
const Service = require("./service");

const {
  ResourceNotFound,
  BadRequest,
  Conflict,
  Unauthorized,
} = require("../../utils/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  INVALID_REQUEST_PARAMETERS,
  EXISTING_USER_EMAIL,
  MALFORMED_TOKEN,
  EXPIRED_TOKEN,
} = require("../../utils/httpErrorCodes");
const { resetPassMail, confirmReset } = require("../../utils/email-template");

this.service = new Service();

const registerUser = async (req, res) => {
  const userSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });
  const validUser = userSchema.parse(req.body);

  const token = await this.service.register(validUser, res);
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 3 * 60 * 60,
  });
  return res.created("Registeration successful");
};

const loginUser = async (req, res) => {
  const userSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  const validUser = userSchema.parse(req.body);

  const token = await this.service.login(validUser);

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 3 * 60 * 60,
  });

  return res.ok("Login successful");
};

const forgotPassword = async (req, res, next) => {

  await this.service.sendLink(req.body);
  
  return res.ok("Reset link sent successfully");
};

const resetPassword = async (req, res) => {
   const validatedData = resetPass.parse(req.body);

  await this.service.resetPass(validatedData, req_params);
  
  return res.ok("Password reset successful");
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
