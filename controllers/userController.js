const express = require("express");
const app = express();

// jwt
const jwt = require("jsonwebtoken");

// Read dotenv files
require("dotenv").config();

//JWT SECRET
const JWT_ACCESS_SECRET = process.env.SECRET;

// JWT RT SECRET
const JWT_REFRESH_SECRET = process.env.RTSECRET;

// User model
const User = require("../models/user");

// User Auth model
const UserAuth = require("../models/userAuth");

// bcrypt
const bcrypt = require("bcryptjs");

// Register user
const userRegister = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
    });

    const refreshToken = "randomstring";

    // Sending hashed password in userauth
    await UserAuth.create({
      username: username,
      password: hashedPassword,
      refreshToken: refreshToken,
    });

    // log user
    console.log(user);
    res
      .status(200)
      .json({ status: "ok", message: "User successfully registered..." });
  } catch (err) {
    console.error("Error: ", err);
    res.status(400).json({ status: "error", message: "Error Occured!" });
  }
};

// Login user
const userLogin = async (req, res) => {
  const { username, password } = req.body;

  // Find user from database
  const user = await UserAuth.findOne({ username }).lean();

  const userData = { id: user._id, username: user.username };

  // Check if user exists
  if (!user) {
    return res
      .status(401)
      .json({ status: "error", error: "Invalid Username/Password" });
  }

  // JWT Generation
  if (await bcrypt.compare(password, user.password)) {
    // generate access-token
    const accessToken = await jwt.sign(userData, JWT_ACCESS_SECRET, {
      expiresIn: "10m",
    });
    console.log("Access-Token: ", accessToken);

    // generate refresh-token
    const refreshToken = await jwt.sign(userData, JWT_REFRESH_SECRET);
    await UserAuth.findOneAndUpdate(
      { username: username },
      { refreshToken: refreshToken }
    );

    console.log("Refresh-Token: ", refreshToken);

    return res
      .set({
        "access-token": accessToken,
      })
      .json({ refreshToken });
  }
};

// Get user
const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  // console.log(user);
  res.status(200).json({ status: "ok", user: user });
};

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find();
  // console.log(users);
  res.status(200).json({ status: "ok", users: users });
};

// Remove user
const userRemove = async (req, res) => {
  const { id } = req.params;
  await User.findOneAndDelete({ _id: id });

  res
    .status(200)
    .json({ status: "ok", message: "User successfully deleted.." });
};

// Update user
const userUpdate = async (req, res) => {
  const { id } = req.params;
  const { newUsername } = req.body;

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { username: newUsername }
  ).lean();

  console.log(updatedUser);
  return res.status(200).json({ status: "ok", data: updatedUser });
};

// Get Access Token
const getAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  const user = await UserAuth.findOne({ refreshToken }).lean();

  if (!refreshToken) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (user.refreshToken === "randomstring") {
    return res
      .status(403)
      .json({ message: "Login to generate Refresh refreshToken" });
  }
  const userData = { id: user._id, username: user.username };

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, user) => {
    if (err) {
      return res.status(403);
    }

    // generate new access-token
    const accessToken = jwt.sign(userData, JWT_ACCESS_SECRET, {
      expiresIn: "20m",
    });

    // generate new refresh-token
    const rfToken = jwt.sign(userData, JWT_REFRESH_SECRET);

    // update newly generated refresh-token in db
    await UserAuth.findOneAndUpdate(
      { username: user.username },
      { refreshToken: rfToken }
    ).lean();

    // send access-token in header & refresh-token in body
    res
      .header({ "access-token": accessToken })
      .json({ accessToken: accessToken, refreshToken: rfToken });
    console.log("New access-token generated!");
  });
};

module.exports = {
  userRegister,
  userLogin,
  userRemove,
  userUpdate,
  getAllUsers,
  getUser,
  getAccessToken,
};
