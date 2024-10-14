const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Badge = require('../models/badge');
const { validationResult } = require('express-validator');
const JWT_SECRET = process.env.JWT_SECRET;

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

exports.signup = signup