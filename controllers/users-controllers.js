const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Badge = require("../models/badge");

let loggingUserList = []

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // withour displaying password...
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(  
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { username, email, password, full_name } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  const badgeObj = await Badge.findOne({ position: "Rookie" });

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt)

  const createdUser = new User({
    username,
    password: hashPassword,
    full_name,
    email,
    profile_photo: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
    badgeId : badgeObj._id,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  loggingUserList.push(email)
  res.json({ message: "Logged in!" });
};

const logout = async (req, res, next)=>{
  const { email, password } = req.body;

  let loggingUser = loggingUserList.includes(email);

  if(!loggingUser){
    const error = new HttpError(
      "You are not logged in.",
      401
    );
    return next(error);
  }

  const index = loggingUserList.indexOf(email);
  loggingUserList.splice(index, 1)

  res.json({ message: "Logged out!" });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.logout = logout;