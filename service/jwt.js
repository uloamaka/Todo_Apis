const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.jwtSecret;

class JWTService {
  async generateToken(id) {
    const access_token = jwt.sign({ id }, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
      audience: "API",
      issuer: "SMS",
    });
    return { access_token };
  }

  async verifyAccessToken(token) {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (!decodedToken)
      throw new BadRequestException("Token is invalid or expired");
    return { decodedToken };
  }
}

module.exports = new JWTService();
