const mongoose = require('mongoose');

const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            ValidationErrors: errors.array()
        })
    }

    const product = new Product({
        // _id: new mongoose.Types.ObjectId('678f94dd7b5baf30e717f0ba'),
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });

    product
        .save()
        .then(result => {
            // console.log(result);
            console.log('Created Product');
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log('An Error Occurred!');
            console.log(err)
            // return res.status(500).render('admin/edit-product', {
            //     pageTitle: 'Add Product',
            //     path: '/admin/add-product',
            //     editing: false,
            //     hasError: true,
            //     product: {
            //         title: title,
            //         imageUrl: imageUrl,
            //         price: price,
            //         description: description
            //     },
            //     errorMessage: 'Database Operation Failed!',
            //     ValidationErrors: []
            // })
            // res.redirect('/500');
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        // Product.findByPk(prodId)
        .then(product => {
            // throw new Error('Dummy Error')
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDescription,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    Product
        .findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;

            return product.save()
                .then(result => {
                    console.log('UPDATED PRODUCT!!!');
                    res.redirect('/admin/products');
                })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.getProducts = (req, res, next) => {
    // restrict user to only delete products they have created. Not allowing others
    Product.find({ userId: req.user._id })
        // { userId: req.user._id }
        // Populate related fields
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            // console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({
        _id: prodId,
        userId: req.user._id
    })
        .then(() => {
            console.log("PRODUCT DESTROYED!!!");
            res.redirect('/admin/products')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
};