const jwt = require("../service/jwt");

const { Unauthorized } = require("../utils/httpErrors");

const { USER_NOT_VERIFIED } = require("../utils/httpErrorCodes");

const userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    const verified = jwt.verifyAccessToken(token);

    if (!verified) {
      return next(new Unauthorized(err.message, USER_NOT_VERIFIED));
    } else {
      req.user = {
        id: verified.id,
      };
      next();
    }
  } else {
    return next(
      new Unauthorized("Not authorized, token not available", USER_NOT_VERIFIED)
    );
  }
};

module.exports = { userAuth };
