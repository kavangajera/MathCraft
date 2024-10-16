const express = require('express')
const { check, validationResult } = require('express-validator');

const userController = require('../controllers/users-controllers');
const signupController = require('../controllers/signup-controller');
const router = express.Router()
const basicAuthMiddleware = require('../controllers/auth-controller');
const { isAuth } = require('../controllers/users-controllers');
router.get('/', userController.getUsers);
const multer = require('multer');

const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB (adjust as needed)
});

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

router.patch("/edit-name/:userId/:Name", userController.editName);


router.post('/login',userController.login);

router.post('/logout', userController.logout);

router.get('/current', isAuth, userController.getCurrentUser);

router.get('/check-auth', isAuth, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
  });

  router.patch(
    "/:userId/update-password",
    [
      check("currentPassword")
        .not()
        .isEmpty()
        .withMessage("Current password is required"),
      check("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long"),
    ],
    userController.updatePassword
  );
  
  router.post("/send-otp", userController.sendOtpEmail);
  
  router.post("/verify-otp", userController.verifyOtp);
  
  router.post("/reset-password", userController.resetPassword);

  router.patch("/:userId/update-photo",upload.single('profilePhoto'),userController.editPhoto)


module.exports = router;