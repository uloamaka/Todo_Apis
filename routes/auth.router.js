const router = require("express").Router();

const registerUser = require("../api/auth/controller");

router.post("/register", registerUser.registerUser);

router.post("/login", registerUser.loginUser);

router.post("/forget-password", registerUser.forgotPassword);

router.post("/reset-password/:userId/:resetToken", registerUser.resetPassword);

module.exports = router;
