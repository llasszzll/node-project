const path = require('path');

// Create a server and Packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://llasszzll:G1y6YtEu7pTWgUBQ@cannabury.0gqsb.mongodb.net/shop?'

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
    // set expiry of the session
});

const csrfProtect = csrf();

// hbs = Handlebars - NEVER USER HANDLEBARS EVER AGAIN! BULLSHIT!
// Again, dont ever use HANDLEBARS

// app.set('view engine', 'pug');  CURRENTLY set to EJS
app.set('view engine', 'ejs');
app.set('views', 'views')

const adminRoutes = require('./routes/admin');  // Middleware routes
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
// const { constants } = require('buffer');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))  // serve static CSS
app.use(
    session({
        secret: 'secretsession',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(csrfProtect);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next()
})

// Middleware entry
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log("DataBaseConnected");
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })






/*             SEQUELIZE ENRTY                   */

// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

// app.use((req, res, next) => {
//     User.findByPk(1)
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(err => console.log(err))
// });

// // Add Sequelize to SQL entry point
// // THROUGH is a in-between table relation
// Product.belongsTo(User, { constants: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
//     // .sync({ force: true }) // FORCE to add new tables to SQL
//     .sync()
//     .then(result => {
//         return User.findByPk(1);
//         // console.log(result);
//     })
//     .then(user => {
//         if (!user) {
//             return User.create({
//                 name: 'Llasszzll',
//                 email: 'llasszzll@email.com'
//             })
//         };
//         return user;
//     })
//     .then(user => {
//         // console.log(user);
//         return user.createCart()
//             .then(cart => {
//                 app.listen(3000);
//             })
//         // console.log(user);
//     })
//     .catch(err =>
//         console.log(err));
