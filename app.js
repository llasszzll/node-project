const path = require('path');

// Create a server and Packages
const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error')
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

// hbs = Handlebars - NEVER USER HANDLEBARS EVER AGAIN! BULLSHIT!

// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', 'views')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { constants } = require('buffer');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))  // serve static CSS

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Add Sequelize to SQL entry point
// THROUGH is a in-between table relation
Product.belongsTo(User, { constants: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
    // .sync({ force: true }) // FORCE to add new tables to SQL
    .sync()
    .then(result => {
        return User.findByPk(1);
        // console.log(result);
    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'Llasszzll',
                email: 'llasszzll@email.com'
            })
        };
        return user;
    })
    .then(user => {
        // console.log(user);
        return user.createCart()
            .then(cart => {
                app.listen(3000);
            })
        // console.log(user);
    })
    .catch(err =>
        console.log(err));
