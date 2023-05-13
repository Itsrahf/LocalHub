const Buyer = require("../models/buyer");
const Seller = require("../models/seller");
const bcrypt = require('bcrypt');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {
        email: '',
        password: '',
        phone: '',
        maroofLicense:''
    };


    // incorrect email error
    if (err.message === 'incorrect email') {
        errors.email = 'that email is incorrect';
    }

    // incorrect password error
    if (err.message === 'incorrect password') {
        errors.password = 'that password is incorrect';
    }

    // incorrect phone error / for sign up
    if (err.message === 'incorrect phone number') {
        errors.phone = 'that phone number is incorrect';
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('buyer validation failed')) { // console.log(err);
        Object.values(err.errors).forEach(({properties}) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) 
            console.log(err);
        

        res.redirect('/');
    });
}

// controller actions / post and get methods
module.exports.signup_get = (req, res) => {
    res.render('BuyerSignUp', {error: ""});
}

module.exports.login_get = (req, res) => {
    res.render('signIn');
}

module.exports.signup_post = async (req, res) => {
    const { name, phone, password } = req.body;
    const email = req.body.email.toLowerCase();
    try {
      // Check if the email already exists in the seller or buyer collection
      const selleremail = await Seller.findOne({ sellerEmail: email  });
      const buyeremail = await Buyer.findOne({ email });
      const sellerphone = await Seller.findOne({ sellerPhone: phone  }); 
      const buyerphone = await Buyer.findOne({ phone }); 
      if (selleremail || buyeremail) {
        throw new Error('This email already exists! Please use a different email address.');
        } else if (sellerphone || buyerphone ) {
        throw new Error('This phone number already exists!. Please use a different phone number.');
      }  else {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newBuyer = await Buyer.create({ name, email, phone, password: hashedPassword });
        req.session.user = {
          user: newBuyer,
          role: 'buyer'
        };
        req.session.isLoggedIn = true;
        res.status(201).redirect('/');
      }
    } catch (err) {
    //   console.log(err.message);
    //   const errors = handleErrors(err);
      res.status(400).render('BuyerSignUp', { error: err.message });
    }
  };

  

module.exports.login_post = async (req, res) => {
    // to lower case so that the email isn't case sensitive 
    const email=req.body.email.toLowerCase();
    const password=req.body.password;
    console.log(email)
    // let isMatch = false;
    let isMatch;

    try {
        const isBuyer = await Buyer.findOne({email});
        const isSeller = await Seller.findOne({sellerEmail: email});
        if (! isBuyer && ! isSeller ) {
            throw new Error("You don't have an account")
        }
        if (isBuyer) { // if we find an email the value of isBuyer would be true
            isMatch = await bcrypt.compare(password, isBuyer.password) // check if the buyer password is correct
        } else if(isSeller) { // and the seller password is correct
            isMatch = await bcrypt.compare(password, isSeller.sellerPassword)
            if(isMatch && isSeller.status  === 'pending'){
                return res.send('your account is waiting for approval from admin');
            }
        } 
        if (! isMatch) {
            throw new Error("Password is not correct!")
        }

        req.session.user = {
            // user: isBuyer ? isBuyer : isSeller ? isSeller : isAdmin,
            // role: isBuyer ? 'buyer' : isSeller ? 'seller' : 'admin' 
            user: isBuyer ? isBuyer : isSeller,
            role: isBuyer ? 'buyer' : 'seller'
        } // this is a one line if statement which is checking if you are a buyer and if not then youre a seller
        req.session.isLoggedIn = true;
        if(isBuyer){
            res.status(200).redirect('/') // if this error appears 'req.session.user' you can either remove the '' or add '...req.session.user'
        }
        else if(isSeller){
            res.status(200).redirect(`/seller/${isSeller.brandName.replace(/ /g, "-").toLowerCase()}`); 
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(err.message);
    }
    // sending bsck info to the user so they can know whats wrong catch (err) {
}

// router.get('/seller/signup', AuthController.sellersSignup_get);
// router.post('/seller/signup', AuthController.sellerSignup_post);

module.exports.sellersSignup_get = (req, res) => {
    res.render('sellerSignUp');
}

module.exports.sellerSignup_post = async (req, res) => { 
    const brandName = req.body.brandName.toLowerCase();
    const brandDescription = req.body.brandDescription;
    const sellerEmail = req.body.sellerEmail.toLowerCase(); 
    const brandLogo = req.file.filename; 
    const sellerPassword = req.body.sellerPassword;
    const maroofLicense = req.body.maroofLicense;
    const sellerPhone = req.body.sellerPhone;
    const instagram = req.body.instagram;
    const tiktok = req.body.tiktok;
    const snapchat = req.body.snapchat;
  
    try {
        // Check if the maroofLicense already exists in the database
      const existingSeller = await Seller.findOne({ maroofLicense });
      // Check if the brand already exists in the database
      const existingBrand = await Seller.findOne({ brandName });
        // Check if the email already exists in the database
      const selleremail = await Seller.findOne({ sellerEmail  });
      const buyeremail = await Buyer.findOne({ email :sellerEmail });
      // Check if the phone number already exists in the database
      const sellerphone = await Seller.findOne({ sellerPhone  }); 
      const buyerphone = await Buyer.findOne({ phone : sellerPhone }); 
      if (existingSeller) {
        throw new Error('This Maroof license number is already taken. Please try a different one.');
      } else if(existingBrand){
        throw new Error('This brand name is already taken. Please log in to access your account.');
      }else if (selleremail || buyeremail) {
        throw new Error('This email already exists! Please use a different email address.');
        } else if (sellerphone || buyerphone ) {
        throw new Error('This phone number already exists!. Please use a different phone number.');
      } else {
        const hashedPassword = await bcrypt.hash(sellerPassword, 12);
        const seller = new Seller({
          brandName,
          brandDescription,
          sellerEmail,
          brandLogo,
          sellerPassword: hashedPassword,
          maroofLicense,
          sellerPhone,
          instagram,
          tiktok,
          snapchat
        });
        await seller.save();
        res.status(201).redirect('/signin'); //CHANGE THIS TO INDEX INSTEAD OF SIGN IN
      }
    } catch (err) {
      const errors = handleErrors(err);
      console.log(err.message); // Log the errors object
  
      res.status(400).render('sellerSignUp', { error1: err.message , path: '/seller/signup' });
    }
  };
  



