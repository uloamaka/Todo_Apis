const bcrypt = require("bcrypt");
const jwt = require("../../service/jwt");
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
  async register(payload, res) {
    const { email, password } = payload;
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Conflict("Email already exists", EXISTING_USER_EMAIL);
    }
    const hash = bcrypt.hashSync(password, 10);
    const user = await User.create({
      email,
      password: hash,
    });

    const data = await jwt.generateToken(user.id);
    return { data };
  }

  async login(payload) {
    const { email, password } = payload;
    const user = await User.findOne({ email });

    if (!user) {
      throw new ResourceNotFound(
        "No record of this account, sign up now.",
        RESOURCE_NOT_FOUND
      );
    }
    const match = bcrypt.compare(password, user.password);

    if (!match) throw new BadRequest("Error comparing passwords");

    const data = await jwt.generateToken(user.id);
    return { data };
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

  async resetPass(payload, req_params) {
    const { resetToken, userId } = req_params;
    const { newPassword } = payload;
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

module.exports = Service;
