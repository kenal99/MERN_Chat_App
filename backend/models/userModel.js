const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/z/profile-anonymous-face-icon-gray-silhouette-person-male-default-avatar-photo-placeholder-isolated-white-background-profile-107327860.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
