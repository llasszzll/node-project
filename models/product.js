const mongodb = require('mongodb');
const getDb = require('../util/database').getDb; // MongoDb database function from datajas.js

// What I am getting from a product when making a request
class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }
    // saving item to database
    // insert 1 item to database that has a condition .then() and .catch() if error
    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            // Update the product
            dbOp = db
                .collection('products')
                .updateOne({ _id: this._id }, { $set: this });
        } else {
            // Insert new doc in database
            dbOp = db.collection('products').insertOne(this);
            // insertMany()
        }
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(prodId) {
        const db = getDb();
        return db
            .collection('products')
            .find({ _id: new mongodb.ObjectId(prodId) })
            .next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            })
    }
    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then(result => {
                console.log('DELETED 1 ITEM');
            })
            .catch(err => {
                console.log(err);
            })

    }
}

// REMEBER to export your files so that it can be reached you idiot!
module.exports = Product;



/* -------------------------------------------------------*/
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

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