const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

module.exports = Product;



/* -------------------------------------------------------*/
// const db = require('../util/database')

// const Cart = require('./cart');


// module.exports = class Product {
//     constructor(id, title, imageUrl, description, price) {
//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

//     save() {
//         return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
//             [this.title, this.price, this.imageUrl, this.description]
//         );
//     };

//     static deleteById(id) {
//     };

//     static fetchAll() {
//         return db.execute('SELECT * FROM products');
//     };

//     static findById(id) {
//         return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
//     }
// };


// "p" is defined for global scope on this file
// const p = path.join(
//     path.dirname(require.main.filename),
//     'data',
//     'products.json'
// );

// Function over here
// Understand the THIS keyword
// const getProductsFromFile = cb => {
//     fs.readFile(p, (err, fileContent) => {
//         if (err) {
//             cb([]);
//         } else {
//             cb(JSON.parse(fileContent));
//         };
//     });
// };

// getProductsFromFile(products => {
//     if (this.id) {
//         const existingProductIndex = products.findIndex(prod => prod.id === this.id);

//         const updatedProducts = [...products];
//         updatedProducts[existingProductIndex] = this;
//         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//             console.log(err);
//         });
//     } else {
//         this.id = Math.random().toString();
//         products.push(this);
//         fs.writeFile(p, JSON.stringify(products), (err) => {
//             console.log(err);
//         });
//     }
// })

// getProductsFromFile(products => {
//     const product = products.find(prod => prod.id === id)
//     const updatedProducts = products.filter(prod => prod.id !== id);
//     fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//         if (!err) {
//             Cart.deleteProduct(id, product.price);
//         }
//     })
// });

// getProductsFromFile(cb);

// getProductsFromFile(products => {
//     const product = products.find(p => p.id === id);
//     cb(product);
// });