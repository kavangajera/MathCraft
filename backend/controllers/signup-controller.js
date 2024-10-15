const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Badge = require('../models/badge');
const cloudinary = require('cloudinary').v2;
const { validationResult } = require('express-validator');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Signup function
const signup = async (req, res, next) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { username, email, password, full_name, profile_photo } = req.body;

  // Check if the user already exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return next(new HttpError('Signing up failed, please try again later.', 500));
  }

  if (existingUser) {
    return next(new HttpError('User exists already, please login instead.', 422));
  }

  const badgeObj = await Badge.findOne({ position: 'Rookie' });

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  let profilePhotoUrl = 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg'; // Default photo

  // Upload image to Cloudinary if a Base64 string was provided
  if (profile_photo) {
    try {
      // Remove the prefix 'data:image/png;base64,' or other prefixes if present
      const base64Data = profile_photo.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Upload image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'profile_photos' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(buffer);
      });
      profilePhotoUrl = result.secure_url; // Get the secure URL
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return next(new HttpError('Image upload failed, please try again.', 500));
    }
  }

  // Create a new user
  const createdUser = new User({
    username,
    password: hashPassword,
    full_name,
    email,
    profile_photo: profilePhotoUrl,
    badgeId: badgeObj._id,
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Signing up failed, please try again.', 500));
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: createdUser.id, email: createdUser.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Set token in cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000, // 1 hour
  });

  res.status(201).json({
    message: 'User created successfully',
    userId: createdUser.id,
    email: createdUser.email,
  });
};

module.exports = { signup };
