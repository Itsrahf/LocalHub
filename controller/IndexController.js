// index controller
const Product = require("../models/product");
const Seller = require("../models/seller");
const Buyer = require("../models/buyer");

exports.getIndex = async(req, res, next) => {
    const seller = await Seller.find();
    res.render("index", {path: "/", seller});
}

exports.getProfile = async (req, res, next) => { // const email = req.session.user.user.email;
    const buyer = await Buyer.findOne({_id: req.session.user.user._id});
    res.render("buyerProfile", {
        path: '/profile',
        buyer
    });
}
// This is to edit the profile of the buyer
exports.postProfile = async (req, res, next) => {
    const buyer = await Buyer.findOne({_id: req.session.user.user._id});

    try {
      // get info from profile form
      const { email, phone } = req.body;
  
      // check if it exists in the database
      if(email!=buyer.email){ //if the email is updated
        const buyeremail = await Buyer.findOne({ email }); //check if it exists in the database
        if (buyeremail) { //throw an error if its already in the database
            throw new Error('This email already exists! Please use a different email address.');
          }
      }
      if(phone!=buyer.phone){
        const buyerphone = await Buyer.findOne({ phone });
        if(buyerphone){
             throw new Error('This phone number already exists! Please use a different phone number.');
        } 
      } else {
        const buyer = await Buyer.findOneAndUpdate({
          _id: req.session.user.user._id
        }, req.body);
        res.redirect('/profile');
      }
    } catch (err) {
        res.status(400).render('buyerProfile', { buyer, error: err.message, path:'/profile' });

    }
  };
  

// sign up for the buyer 
// exports.getSignUp = (req, res, next) => {
//     res.render("BuyerSignUp", {path: '/signUp'});
// }

// // sign up for the seller
// exports.getSellerSignUp = (req, res, next) => {
//     res.render("sellerSignUp", {path: '/SellerSignUp'});
// }

// renders the shopping page and passes the products to it
exports.getShopping = async (req, res, next) => {
    const products = await Product.find();
    const seller = await Seller.find();
    res.render('shopping', {
        prod: products,
        seller,
        path: '/shopping',
        pageTitle: 'Shopping Page'
    });
};


exports.getShopBrandPage = async (req, res, next) => {
    const brandName = req.params.brandname.replace(/-/g, ' ');
    res.redirect(`/seller/${brandName}`)
};

//there is an error here when we display the detaiked product page / its crashing because the user has to be in a session to view 
exports.getDetailedProduct = async (req, res, next) => {
    const {prodId} = req.params;
    try{
        const product = await Product.findOne({_id: prodId}).populate('seller'); 
        console.log(product);
        return res.render("buyerDetailedProduct", { path: "/prod", product });
    }catch (err){
        console.log(err.message)
        res.redirect('/shopping');
        // /shopping/ , + req.session.user.user.brandname
    }
};




