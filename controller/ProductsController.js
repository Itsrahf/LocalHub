const Product = require('../models/product');
const Cart = require('../models/cart');
const Checkout = require('../models/checkout');
const Seller = require('../models/seller');
const mongoose = require('mongoose');

// rendering all products to the shopping
exports.getAllProducts = async (req, res, next) => {
    const products = await Product.find();
    res.render('shopping', {
        prod: products,
        path: '/shopping',
        pageTitle: 'Shopping Page'
    });
};

exports.getBuyerOrders = async (req, res) => {
    const userId = req.session.user.user._id;
    const checkouts = await Checkout.find({ userId: userId }).populate('cartId');
    console.log(checkouts);
    res.render('buyerOrders', { checkouts, path: '/orders' });
  };


exports.getProductDetail = (req, res, next) => {
    const products = Product.findById(req.params.prodId);
    res.render('sellerDetailedProducts', {
        prod: products[0],
        pageTitle: 'Product Detail',
        path: '/sellerDetailedProducts'
    });
};


