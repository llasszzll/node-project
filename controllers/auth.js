const User = require('../models/user')
// Store items in a request (req.?) so that you can use them later
// which is why you can import it here
exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    })
};

exports.postLogin = (req, res, next) => {
    User.findById('678f85e5e39c0157de4b6037')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // Once logged in, have to refresh to get full view of nav. Following fix
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err))
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/')
    });
};

// Cookie with key-value pair - HTTP date format - How long you want to track the user
// res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');