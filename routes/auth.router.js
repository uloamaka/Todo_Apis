const router = require("express").Router();

const registerUser = require("../controllers/auth.controller");

router.post("/register", registerUser.registerUser);

router.post("/login", registerUser.loginUser);

router.post("/forget-password", registerUser.forgotPassword);

router.post("/reset-password/:userId/:resetToken", registerUser.resetPassword);

module.exports = router;
