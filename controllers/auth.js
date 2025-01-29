const crypto = require('crypto'); // pass reset token

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); // only allow nodemailer to enter this :path
const User = require('../models/user');

const { validationResult } = require('express-validator')

// api key:  AIzaSyBQiZVU4F0IFDUMmjwETN5wt96wKLBTMo8
// test account
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "d5019bffa23018",
        pass: "024efe5997459b",
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Store items in a request (req.?) so that you can use them later
// which is why you can import it here
exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    })
};

exports.getSignUp = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationErrors: []
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: errors.array()
            })
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res
                    .status(422)
                    .render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid Email or Password.',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    })
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        // Once logged in, have to refresh to get full view of nav. Following fix
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        });
                    };
                    return res
                        .status(422)
                        .render('auth/login', {
                            path: '/login',
                            pageTitle: 'Login',
                            errorMessage: 'Invalid Email or Password.',
                            oldInput: {
                                email: email,
                                password: password
                            },
                            validationErrors: []
                        })
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login');
                })

        })
        .catch(err => console.log(err))
};

// extract info from incoming request
exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422)
            .render('auth/signup', {
                path: '/signup',
                pageTitle: 'Sign Up',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password,
                    confirmPassword: req.body.confirmPassword
                },
                validationErrors: errors.array()
            })
    }

    // check if duplicate user exist. - based on promise
    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            })
            return user.save()
        })
        .then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: 'llasszzll.lategan@gmail.com',
                from: 'llasszzll@gmail.com',
                subject: 'Notification',
                html: '<h1>You have successfully signed up. Thank You!</h1><hr><h2>Hello from EARTH.</h2>'
            })
        })
        .catch(err => {
            console.log(err)
        })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        res.render('auth/reset', {
            path: '/reset',
            pageTitle: 'Reset Password',
            errorMessage: message
        })
    }
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No Account with Email Address');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // milliseconds
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'llasszzll@gmail.com',
                    subject: 'Notification | Password Reset',
                    html: `
                    <p>You have requested as password reset?</p>
                    <p>Click the <a href="http://localhost:3000/reset/${token}"> LINK</a> to reset the password.</p>
                    `
                })
            })
            .catch(err => {
                console.log(err);
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
    })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/newpassword', {
                path: '/newpassword',
                pageTitle: 'New Updated Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: date.now() },
        _id: userId

    })
        .then(user => {
            resetUser = user
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;

            return resetUser.save()
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => {
            console.log(err);
        })
}

// Cookie with key-value pair - HTTP date format - How long you want to track the user
// res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');