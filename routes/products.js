// equivelent to shop.js 

const express = require('express');

const ProductsController = require('../controller/ProductsController');


const router = express.Router();

// router.get('/shopping', ProductsController.getAllProducts); 

router.get('/orders', ProductsController.getBuyerOrders); 

///anything above this is finalized. Don't delete it. 


// router.get('/seller/products', ProductsController.getProductList); come back to this?

// get product by its id
// router.get('/products/:prodId', ProductsController.getProductDetail);


// router.post('/add-to-cart', shopController.addToCart);

// router.get('/cart', shopController.getCart);

// router.post('/delete-cart', shopController.deleteInCart);

module.exports = router;
