const path = require('path');

// Create a server and Packages
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

// hbs = Handlebars - NEVER USER HANDLEBARS EVER AGAIN! BULLSHIT!
// Again, dont ever use HANDLEBARS

// app.set('view engine', 'pug');  CURRENTLY set to EJS
app.set('view engine', 'ejs');
app.set('views', 'views')

const adminRoutes = require('./routes/admin');  // Middleware routes
const shopRoutes = require('./routes/shop');
// const { constants } = require('buffer');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))  // serve static CSS

app.use((req, res, next) => {
    User.findById('678d38153db93c8454d8e701')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err))
});

// Middleware entry
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
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
