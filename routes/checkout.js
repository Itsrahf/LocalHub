const express = require('express');
const router = express.Router();

// const cartController = require('../controller/CartController');
const CheckoutController = require('../controller/CheckoutController');



// set up route to the checkout page
// router.get('/', CheckoutController.checkout_get);

// Handle GET request for the checkout page
// router.get('/', CheckoutController.checkout_get) 
// set up route to the checkout page
router.post('/', CheckoutController.checkout_post);


    // Get the current user's role from the session
   

    // Render the checkout page with the navbar partial
    // res.render('theCheckout', { path: '/checkout', role });
  




module.exports = router;