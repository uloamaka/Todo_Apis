const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "Basic",
    },
  },
  { required: true, timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
