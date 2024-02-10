const jwt = require("../service/jwt");

const { Unauthorized } = require("../utils/httpErrors");

const { USER_NOT_VERIFIED } = require("../utils/httpErrorCodes");

const userAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    const data = await jwt.verifyAccessToken(token);
    if (data !== undefined && data !== null) {
      req.user = {
        id: data.decodedToken.id,
      };
      next();
    } else {
      return next(
        new Unauthorized(
          "Not authorized, token not available",
          USER_NOT_VERIFIED
        )
      );
    }
  } else {
    return next(
      new Unauthorized("Not authorized, token not available", USER_NOT_VERIFIED)
    );
  }
};

module.exports = { userAuth };
