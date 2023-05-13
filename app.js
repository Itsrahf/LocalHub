// Require the npm frameworks
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const isAuth = require("./middleware/isAuth");
const cookieParser=require('cookie-parser');
const session = require("express-session");
const stripe = require('stripe');
const flash = require('connect-flash');
const multer = require('multer');
const CheckOut = require("./models/checkout");
const Cart = require("./models/cart");
const Product = require("./models/product");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
// configuring the dotenv file
dotenv.config();

// not sure if this is working
const paymentKey = process.env.STRIPE_SECRET_KEY;

//register view engine
app.set('view engine', 'ejs');
app.set("views", "views");

//middleware
app.use(express.static(__dirname + '/public'));
// Add body-parser middleware to handle http requests
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// const upload = multer({ dest: 'public/uploads/' }).single('brandLogo')


const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: "sessions",
  });
  
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);
app.use(flash());

  
//middleware to check is user is authenticated
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  if (req.session.user) { //if theyre authenticated
    res.locals.role = req.session.user.role; //this will get either seller or buyer from authcontroller
    if(req.session.user.role == 'seller'){
      res.locals.brandName = req.session.user.user.brandName; //so that we can use it for the navbar to display brandpage for the seller
      res.locals.sellerId = req.session.user.user._id; //so that we can use it for the navbar to display brandpage for the seller
    
    }
  } else {
    res.locals.role = 'guest';
  }
  next();
});


//Routers
const indexRouter = require('./routes/index');
const authRouter = require("./routes/auth");
const sellerRouter = require("./routes/seller");
const cartRouter = require("./routes/cart");
const checkoutRouter = require("./routes/checkout");
const productRouter = require("./routes/products");


// Calling routers
// order here within the routes matters
app.use(authRouter);
app.use(productRouter);
app.use("/cart",cartRouter);
app.use("/checkout" , checkoutRouter);
app.use("/seller", sellerRouter);
app.use(indexRouter);

app.post('/webhook', (request, response) => {
  const event = request.body;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // shipping: {
      //   address: {
      //     city: 'San Francisco',
      //     country: 'US',
      //     line1: '510 Townsend St',
      //     line2: null,
      //     postal_code: '94103',
      //     state: 'CA'
      //   },
      // console.log(paymentIntent.shipping.address.city);
      console.log('PaymentIntent was successful!');
      // response.redirect('/success');
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log(paymentIntent);
      console.log('PaymentMethod was attached to a Customer!');
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({received: true});
});


// app.use(function(req, res, next) {
//     res.status(404);
//     res.render('404page', {
//       pageTitle: 'Page Not Found',path:"/404"
//     });
//   });


app.get('/success',async (req, res) => {
  const checkoutId = req.session.checkoutId;
  const checkout = await CheckOut.findById(checkoutId);
  console.log(checkout);
  checkout.status = 'paid';
  await checkout.save();
  const cart = await Cart.findOne(checkout.cartId);
  cart.status = 'paid';
  await cart.save();
  // delete checkoutId from session
  delete req.session.checkoutId;
  res.render('success');
});


// Define search route
// app.get('/shopping', async (req, res) => {
//   const searchTerm = req.query.q;
//   const results = await Product.find({ $text: { $search: searchTerm } });
//   res.render('shopping', { results, searchTerm });
// });

// Define search route handler
// Define search route handler
app.post('/shopping', async (req, res) => {
  const searchTerm = req.body.q.toLowerCase();
  console.log('hello')
  const filteredProducts = await Product.find({ name: { $regex: searchTerm, $options: 'i' } });
  res.render('shopping', { prod: filteredProducts });
});







// // Define a post-save middleware to clear the cart after a successful purchase
// checkoutSchema.post('save', async (doc) => {
//   if (doc.status === 'paid') {
//     const cartId = doc.buyer.cart; // retrieve cart id from buyer's cart reference
//     const cart = await Cart.findById(cartId); // retrieve cart from database
//     cart.items = []; // remove all items from cart
//     await cart.save(); // save updated cart to database
//   }
// });


// // Define a post-save middleware to clear the cart after a successful purchase
// checkoutSchema.post('save', async (doc) => {
//   if (doc.status === 'paid') {
//     const cartId = doc.buyer.cart; // retrieve cart id from buyer's cart reference
//     const cart = await Cart.findById(cartId); // retrieve cart from database
//     cart.items = []; // remove all items from cart
//     await cart.save(); // save updated cart to database
//   }
// });



//to connect to the db
const dbURL = process.env.MONGO_URL;
mongoose.set('strictQuery', false);
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(port, () => {
    console.log(`backend server is running at http://localhost:${port}`)}))
  .catch((err) => console.log(err));

// exports.v = upload ;
