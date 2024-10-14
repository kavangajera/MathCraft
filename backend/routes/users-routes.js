const express = require('express')
const { check, validationResult } = require('express-validator');

const userController = require('../controllers/users-controllers');
const signupController = require('../controllers/signup-controller');
const router = express.Router()
const basicAuthMiddleware = require('../controllers/auth-controller');
const { isAuth } = require('../controllers/users-controllers');
router.get('/', userController.getUsers);

router.post(
    '/signup',
    [
      check('username')
          .not()
          .isEmpty(),
      check('email')
          .normalizeEmail()
          .isEmail(),
      check('password')
          .isLength({ min: 8 }) // Minimum length of 8 characters
          .withMessage('Password must be at least 8 characters long')
          .matches(/[A-Z]/) // Must contain at least one uppercase letter
          .withMessage('Password must contain at least one uppercase letter')
          .matches(/[a-z]/) // Must contain at least one lowercase letter
          .withMessage('Password must contain at least one lowercase letter')
          .matches(/[0-9]/) // Must contain at least one digit
          .withMessage('Password must contain at least one number')
          .matches(/[\W_]/) // Must contain at least one special character
          .withMessage('Password must contain at least one special character'),
      check('full_name')
          .not()
          .isEmpty(),
  ],
    signupController.signup
  );

router.patch('/edit/:userId/:Name',basicAuthMiddleware.basicAuthMiddleware,userController.editName);

router.post('/login',userController.login);

router.post('/logout', userController.logout);

router.get('/current', isAuth, userController.getCurrentUser);

router.get('/check-auth', isAuth, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
  });

module.exports = router;