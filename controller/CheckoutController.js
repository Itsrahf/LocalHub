const Checkout = require('../models/checkout');
const Cart = require('../models/cart');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


createStripePaymentLink = async (totalPrice) => {
  console.log('Im here in the payment link api');
  
  // const totalPrice = req.session.totalPrice;
  const orderNumber = generateOrderNumber(); // Generate a unique order number
  const description = `Order ${orderNumber}`;
  const session = await stripe.checkout.sessions.create({
    success_url: `${process.env.SERVER_URL}/success`,
    cancel_url: `${process.env.SERVER_URL}/`,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'AED',
          product_data: {
            name: description,
          },
          unit_amount: totalPrice * 100, // Stripe requires the amount in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['UA'], // Specify which countries are allowed for shipping
    },
  });
  return session.url;
};

function generateOrderNumber() {
  // Generate a unique order number using a timestamp and a random number
  const timestamp = Date.now().toString(36);
  const randomNumber = Math.floor(Math.random() * 1000000).toString(36);
  return `${timestamp}-${randomNumber}`;
};


// this is the route handler
// Handle the checkout form submission
exports.checkout_post = async (req, res) => {
  console.log('checkout_post function called');
  try {
    // Extract the relevant data from the form submission
    const buyer = req.session.user.user._id; // assumes that the user is authenticated
    const totalPrice = req.session.totalPrice;
    const cart = await Cart.findOne({userId: req.session.user.user._id,  status: 'pending'});
    console.log('are you here?');
    // Create a new checkout instance with the extracted data
    const newCheckout = await Checkout.create({
      userId: buyer,
      cartId: cart._id,
      totalPrice
    });
    console.log(newCheckout);
    req.session.checkoutId = newCheckout._id;
    // Save the checkout instance to the database
    // newCheckout.save()

    // Generate a payment link and render the confirmation page
    const paymentLink = await createStripePaymentLink(totalPrice);
    console.log('are you here yet?');

    res.status(301).redirect(paymentLink);
  } catch(err) {
    console.log('Error saving checkout:', err);
    console.log(err.message);
    } 
};

// Clear the cart after purchase
// exports.clear_cart = async (req, res) => {
//   try {
//     console.log('Clearing cart...');
//     const cartId = req.session.cartId; // retrieve cart id from session
//     console.log('Cart ID:', cartId);
//     const cart = await Cart.findById(cartId); // retrieve cart from database
//     console.log('Cart:', cart);
//     cart.items = []; // remove all items from cart
//     await cart.save(); // save updated cart to database
//     console.log('Cart cleared successfully');
//     res.sendStatus(200);
//   } catch(err) {
//     console.log('Error clearing cart:', err);
//     res.sendStatus(500);
//   } 
// };

// // Handle the successful payment
// exports.payment_success = async (req, res) => {
//   try {
//     // Clear the cart after purchase
//     console.log('Calling clear_cart handler...');
//     await clear_cart(req, res);
//     console.log('clear_cart handler called successfully');

//     // Render the success page
//     res.render('success');
//   } catch(err) {
//     console.log('Error handling payment success:', err);
//     res.sendStatus(500);
//   }
// };
  
  