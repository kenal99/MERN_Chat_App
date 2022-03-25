const res = require("express/lib/response");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  var { name, email, password, pic } = req.body;
  const salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  if (!pic) {
    pic =
      "https://thumbs.dreamstime.com/z/profile-anonymous-face-icon-gray-silhouette-person-male-default-avatar-photo-placeholder-isolated-white-background-profile-107327860.jpg";
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User Already Exist");
  }

  const user = await User.create({ name, email, password, pic });

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not created");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.password)) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send("Invalid Email or Password");
  }
});

// /api/user?search=kenal
const getAllUsers = asyncHandler(async (req, res) => {
  console.log(res.query);
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, getAllUsers };
