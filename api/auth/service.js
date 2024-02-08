const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.jwtSecret;
const clientUrl = process.env.clientUrl; // to connect to frontend
const User = require("../../model/userModel");
const { sendMail } = require("../../utils");

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

class Service {
  async register(validUser, res) {
    const { email, password } = validUser;
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
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: maxAge, // 1hrs in sec
      });
      return token;
    });
  }

  async login(validUser) {
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
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
          expiresIn: maxAge, // 3hrs in seconds
        });
        return token;
      }
    });
  }

  async sendLink(payload) {
    const { email } = payload;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ResourceNotFound("User does not exist", RESOURCE_NOT_FOUND);
    }
    const otpToken = JWT_SECRET + user.password;
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
  }

  async resetPass(validatedData, req_params) {
    const { resetToken, userId } = req_params;
    const { newPassword } = validatedData;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new ResourceNotFound("User does not exist", RESOURCE_NOT_FOUND);
    }

    const otpToken = JWT_SECRET + user.password;
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
  }
}

//make a middleware for userExist


module.exports = Service;
