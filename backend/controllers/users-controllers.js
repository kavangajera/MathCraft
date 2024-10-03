const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Badge = require("../models/badge");

// JWT secret key (should be stored in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to parse cookies
const express = require('express');
const app = express();
app.use(cookieParser());

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
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
    console.log(err)
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
    console.log(err)
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: createdUser.id, email: createdUser.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Set token in cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 3600000 // 1 hour
  });

  res.status(201).json({ 
    message: "User created successfully",
    userId: createdUser.id,
    email: createdUser.email
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const trimmedPassword = password.trim();
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
  const isValidPassword = await bcrypt.compare(trimmedPassword, existingUser.password);
  console.log(isValidPassword)
  console.log(trimmedPassword,existingUser.password)
  if (!existingUser || !isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: existingUser.id, email: existingUser.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  console.log("Generated JWT Token: ", token);
  // Set token in cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 3600000 // 1 hour
  });

  res.json({ message: "Logged in!", userId: existingUser.id, email: existingUser.email });
};

const logout = async (req, res, next) => {
  // Clear the token cookie
  res.clearCookie('token');
  res.json({ message: "Logged out!" });
};

const editName = async (req, res, next) => {
  const { userId, Name } = req.params;
  
  let user;
  try {
    user = await User.findById(userId);
    
    if (!user) {
      const error = new HttpError("User not found.", 404);
      return next(error);
    }

    user.full_name = Name;
    await user.save();

    res.status(200).json({ message: "User name updated successfully!", user });
  } catch (err) {
    const error = new HttpError(
      "Updating user's name failed, please try again later.",
      500
    );
    return next(error);
  }
};

// Middleware to check if user is authenticated
const isAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new HttpError('Authentication failed!', 401));
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return next(new HttpError('Authentication failed!', 401));
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.editName = editName;
exports.isAuth = isAuth;