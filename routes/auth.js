const express = require('express');
const { check, body } = require('express-validator')
const authController = require('../controllers/auth')
const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignUp);

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .normalizeEmail(),
        body('password', 'Password must be valid.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin);

// Custom Validator
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter valid email.')
            .custom(async (value, { req }) => {
                // if (value === 'test@test.com') {
                //     throw new Error('This email is forbidden.')
                // }
                // return true;
                const userDoc = await User.findOne({ email: value });
                if (userDoc) {
                    return Promise.reject('Email already exists. Please use a different email.');
                }
            })
            .normalizeEmail(),
        body('password', 'Please enter a password longer than 5 character.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        // custom validator to check Confirm Password
        body('confirmPassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password have to match.')
            }
            return true;
        })
    ],
    authController.postSignUp
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.get('/newpassword', authController.postNewPassword);

module.exports = router;