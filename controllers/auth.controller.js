const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const hbs = require("handlebars");
const fs = require("fs");
const { z } = require("zod");
const {
  emailSchema,
  passwordSchema,
} = require("../validators/formRegister.validator");
const jwtSecret = process.env.jwtSecret;
const clientUrl = process.env.clientUrl; // to connect to frontend
const User = require("../model/userModel");
const { sendMail } = require("../utils");

const {
  ResourceNotFound,
  BadRequest,
  Conflict,
  Unauthorized,
} = require("../utils/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  INVALID_REQUEST_PARAMETERS,
  EXISTING_USER_EMAIL,
  MALFORMED_TOKEN,
  EXPIRED_TOKEN,
} = require("../errors/httpErrorCodes");
const { resetPassMail, confirmReset } = require("../utils/email-template");

const registerUser = async (req, res, next) => {
  const userSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });
  const validUser = userSchema.parse(req.body);
  const { username, email, password } = validUser;
  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new Conflict("Email already exists", EXISTING_USER_EMAIL);
  }
  bcrypt.hash(password, 10, async function (err, hash) {
    if (err) {
      throw new Unauthorized("Error hashing password", MALFORMED_TOKEN);
    }
    const user = await User.create({
      email,
      password: hash,
    });
    const maxAge = 1 * 60 * 60;
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
      expiresIn: maxAge, // 1hrs in sec
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // 1hrs in ms
    });
    let formattedUser = {
      email,
      user_id: user._id,
    };
    return res.created({
      message: formattedUser,
    });
  });
};

const loginUser = async (req, res, next) => {
  const userSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  const validUser = userSchema.parse(req.body);
  const { email, password } = validUser;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ResourceNotFound(
      "No record of this account, sign up now.",
      RESOURCE_NOT_FOUND
    );
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      throw new Error("Error comparing passwords");
    }
    if (result) {
      const maxAge = 3 * 60 * 60;
      const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
        expiresIn: maxAge, // 3hrs in seconds
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
    }
    return res.ok({ message: "Login successful", user: user._id });
  });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ResourceNotFound("User does not exist", RESOURCE_NOT_FOUND);
  }
  const otpToken = jwtSecret + user.password;
  const resetToken = jwt.sign({ id: user._id, email }, otpToken, {
    expiresIn: "1h",
  });
  let userId = user._id;
  const resetLink = `${clientUrl}api/v1/auth/reset-password/${userId}/${resetToken}`;

  await sendMail({
    to: user.email,
    subject: "Password Reset Link",
    html: resetPassMail({ resetLink }),
  });
  return res.ok("Reset link sent successfully");
};

const resetPassword = async (req, res) => {
  const { resetToken, userId } = req.params;
  const { newPassword, confirmPassword } = req.body;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new ResourceNotFound("User does not exist", RESOURCE_NOT_FOUND);
  }
  if (!newPassword || !confirmPassword) {
    throw new BadRequest("No password provided", INVALID_REQUEST_PARAMETERS);
  }
  if (newPassword !== confirmPassword) {
    throw new BadRequest(
      "New password and Confirm password must match",
      INVALID_REQUEST_PARAMETERS
    );
  }
  const otpToken = jwtSecret + user.password;
  try {
    decodedToken = jwt.verify(resetToken, otpToken);
  } catch (err) {
    throw new Unauthorized(err.message, MALFORMED_TOKEN);
  }
  const currentTime = Math.floor(Date.now() / 1000);
  //check if the token is still valid
  if (!decodedToken || (decodedToken.exp && decodedToken.exp < currentTime)) {
    throw new Unauthorized("Reset token is expired", EXPIRED_TOKEN);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.updateOne(
    { _id: userId },
    { password: hashedPassword },
    {
      new: true,
    }
  );

  await sendMail({
    to: user.email,
    subject: "Password Reset Link",
    html: confirmReset(),
  });
  return res.ok("Password reset successful");
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
