const express = require('express');
const router = express.Router();

const cartController = require('../controller/CartController');


// Set up route to show cart page
router.get('/', cartController.displayCart);


// Set up route to add item to cart
router.post('/add/:productPrice', cartController.addToCart);

// Set up route to remove item from cart
router.post('/delete', cartController.deleteCartItem);

// display cart details
router.get('/:cartId', cartController.displayCartDetails);

// Set up route to clear cart
// router.post('/cart/clear', cartController.clearCart);


module.exports = router;

