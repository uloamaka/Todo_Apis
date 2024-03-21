const { z } = require("zod");
const {
  emailSchema,
  passwordSchema,
} = require("../../validators/formRegister.validator");
const Service = require("./service");

this.service = new Service();

const registerUser = async (req, res) => {
  const userSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });
  const validUser = userSchema.parse(req.body);

  const { data } = await this.service.register(validUser, res);

  res.cookie("jwt", data.access_token, {
    httpOnly: true,
    maxAge: 3 * 60 * 60 * 1000,
  });

  return res.created("Registeration successful");
};


const loginUser = async (req, res) => {
  const userSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  const payload = userSchema.parse(req.body);

  let { data } = await this.service.login(payload);
  await res.cookie("jwt", data.access_token, {
    httpOnly: true,
    maxAge: 3 * 60 * 60 * 1000,
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
