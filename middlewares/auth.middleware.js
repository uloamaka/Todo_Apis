const jwt = require("jsonwebtoken");
require("dotenv").config();

const { Unauthorized } = require("../utils/httpErrors");
const { USER_NOT_VERIFIED } = require("../errors/httpErrorCodes");
const jwtSecret = process.env.jwtSecret;

const userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return next(new Unauthorized(err.message, USER_NOT_VERIFIED));
      } else {
        if (decodedToken.role !== "Basic") {
          return next(new Unauthorized("Not authorized", USER_NOT_VERIFIED));
        } else {
          req.user = {
            id: decodedToken.id,
            role: decodedToken.role,
          };
          next();
        }
      }
    });
  } else {
    return next(
      new Unauthorized("Not authorized, token not available", USER_NOT_VERIFIED)
    );
  }
};

module.exports = { userAuth };
