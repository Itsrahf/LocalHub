const Cart = require("../models/cart");
const CheckOut = require("../models/checkout");
// const checkoutController = require('./CheckoutController');

exports.displayCart = async (req, res) => {
  try {
    
    // const checkout = await CheckOut.findOne({userId: req.session.user.user._id, status: 'pending'});
    // Get the cart data from the database and calculate total price
    const cartData = await Cart.findOne({userId: req.session.user.user._id, status: 'pending'}).populate('items.productId', 'name price');

    if (!cartData || cartData && cartData.length == 0){
      return res.render('theCart', { cartItems: [], totalPrice: 0 , path:'/cart'});
    }

    const cartItems = cartData.items.map(item => ({
      id: item.productId._id.toString(),
      img: item.img,
      name: item.name,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity
    }));
    
    
    const totalPrice = cartItems.reduce((acc, curr) => acc + curr.total, 0);
    req.session.totalPrice = totalPrice;
    // Render the cart page with the cart data
    // res.render('theCart', { cartItems, totalPrice, path: '/cart' });
    // const paymentLink = await checkoutController.createStripePaymentLink(totalPrice);
    res.render('theCart', { 
        totalPrice, 
        cartItems,
        path: '/cart',
    });

  } catch(error) {
    // console.error(error);
    res.status(500).send(error.message);
  }
};

exports.deleteCartItem = async (req, res) => {
  const itemId = req.body.itemId;
  try {
    const cartId = await Cart.findOne({userId: req.session.user.user._id, status: 'pending'}).select('_id');
    const result = await Cart.updateOne(
      { _id: cartId },
      { $pull: { items: { productId: itemId } } }
    );
    res.redirect("/cart");
  } catch (err) {    
    console.log(err.message); //change this
  }
};

exports.addToCart = async (req, res) => {
  const { productId, name, quantity, size, img } = req.body;
  const price = req.params.productPrice;
  
  // Check if user is authenticated
  if (req.session.user) {
    // User is authenticated, add item to cart or increment quantity if item already exists
    let cart = await Cart.findOne({userId: req.session.user.user._id,  status: 'pending'});
    // const checkout = await CheckOut.findOne({cartId: cart._id});
    if(!cart || cart.length == 0 ){ 
      await Cart.create({userId: req.session.user.user._id, items: {productId, name, price, quantity, size,img }});
      return res.redirect('/cart')
    }
    //check if the product exists in the cart, then we incrmement the quanitity (iterate between products saved in cart)
    let elemntFound = false;
    cart.items.forEach(element => {
      if (productId == element.productId && size == element.size) {
        elemntFound = true;
        element.quantity++;
      }
    }) 
    //if we don't find the product in the cart, push the product 
    if (!elemntFound){
      cart.items.push({productId, name, price, quantity, size, img})
    }

    cart.save();

  } else {
    // User is not authenticated, add item to cart or increment quantity if item already exists
    return res.redirect('/signup')

  }

  // Save cart object to session
  // req.session.cart = cart;

  res.redirect('/cart')
};


exports.displayCartDetails = async (req, res) => {
  const {cartId } = req.params;
  const cartData = await Cart.findOne({_id: cartId}).populate('items.productId', 'name price');
  res.send(cartData);

}