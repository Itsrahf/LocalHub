const Product = require("../models/product");
const Seller = require("../models/seller")
const CheckOut = require("../models/checkout");

exports.getSellerProducts = async (req, res) => {
    const allProducts = await Product.find();
    res.render('sellerProducts', {
        products: allProducts,
        path: '/seller/products'
    });
}

// get the seller add product page
exports.getAddProduct = (req, res) => {
    res.render('sellerNewProducts', {path: '/'});
}

// router.post('/avatar', (req, res) => {
//     Upload(req, res, (err) => {
//       if (err) return res.send({ error: 'invalid_file' })
//       console.log('save the file', req.file)
//     })
//   })


// post for the seller add product form , what is posting the form
exports.postProduct = (req, res, err) => {
    // get the seller brand name from the session of seller logged in

    // isSeller
    
    const productname = req.body.productname;
    const productdesc = req.body.productdesc;
    const sizeModel = req.body.sizeModel;
    const small = req.body.small;
    const medium = req.body.medium;
    const large = req.body.large;
    const productprice = req.body.productprice;
    const sizeGuide = req.body.sizeGuide;
    const careProcess = req.body.careProcess;
    let productimg1 = null;
    let productimg2 = null;
    let productimg3 = null;
    try {
        productimg1 = req.files['productimg1'][0].filename || null;
        productimg2 = req.files['productimg2'][0].filename || null;
        productimg3 = req.files['productimg3'][0].filename || null;
    } catch (error) {
        console.log(error.message);
    }

    
    const availableSizes = [];
    if (small) {
        availableSizes.push(small);
    }
    if (medium) {
        availableSizes.push(medium);
    }
    if (large) {
        availableSizes.push(large);
    }

    const seller = req.session.user.user._id; // Add the seller ID to the product document
    const prod = new Product({
        productname,
        productprice,
        productdesc,
        sizeModel,
        productimg1,
        productimg2,
        productimg3,
        sizeGuide,
        careProcess,
        availableSizes,
        seller
    });
    
    prod.save();
    // console.log(seller);
    const sellerBrandName = req.session.user.user.brandName;
    res.redirect(`/seller/${sellerBrandName}`);
}


exports.getAllProducts = async (req, res, next) => {
    

    const products = await Product.find();
    res.render('BrandPage', {
        products: products,
        path: '/seller/:brandname',
        pageTitle: 'Seller Products'
    });
};


exports.getProductDetail = (req, res, next) => {
    const products = Product.findById(req.params.prodId);
    res.render('sellerDetailedProducts', {
        prod: products[0],
        pageTitle: 'Product Detail',
        path: '/sellerDetailedProducts'
    });
}


exports.getSellerProfile = async (req, res) => {
    const brandName = req.session.user.user.brandName;
    const seller = await Seller.findOne({brandName});
    res.render('sellerProfile', {
        seller,
        path: '/seller/profile',
        
    });
}

exports.postEditProfile = async (req, res, next) => {
    const seller = await Seller.findOne({_id: req.session.user.user._id});

    try {
        console.log('started')
        // get info from profile form
      const { sellerPhone, sellerEmail } = req.body;
        console.log("First:"+sellerPhone)
        // console.log(sellerEmail)
        console.log("Second:"+seller.sellerPhone)
        // check if it exists in the database
        if(sellerEmail!=seller.sellerEmail){ //if the email is updated
            const emailExists = await Seller.findOne({ sellerEmail }); //check if it exists in the database
            if (emailExists) { //throw an error if its already in the database
                throw new Error('This email already exists! Please use a different email address.');
            }
        }
        if(sellerPhone!=seller.sellerPhone){
            const phoneExists = await Seller.findOne({ sellerPhone });
            console.log('here')
            console.log(phoneExists)
            if(phoneExists){
                throw new Error('This phone number already exists! Please use a different phone number.');
            } 
        }else {
        
            const seller = await Seller.findOneAndUpdate({
                _id: req.session.user.user._id
            }, req.body);
            res.redirect('/seller/profile');
        }
    } catch(err){
        console.log(err.message)
        res.status(400).render('sellerProfile', { seller, error: err.message, path:'/seller/profile'});

    }
};


// controller for all products for that particualar seller in the BRAND PAGE
// this will take the href from the brands displayed on frontend and will render the products for the specific brand as well as the brandpage itself.
exports.getSellerBrandPage = async (req, res, next) => { // /seller/CatToys
    const brandName = req.params.brandName.replace(/-/g, ' ');
    try {
        const seller = await Seller.findOne({brandName}); // Find the seller with the given brandName
        if (!seller) {
            return res.status(404).render('404page', {path: '/404'})
        }
        const products = await Product.find({seller: seller._id}); // Find all products that belong to the seller
        res.render('BrandPage', {
            products,
            path: '/seller/:brandName',
            pageTitle: 'Brand Page',
            seller
        });

    } catch (err) {
        console.log('cant find')
        console.error(err);
        res.status(500).render('404page', {path: '/404'})
    }
};

// this is for the product page
exports.getOneSellerProducts = async (req, res, next) => { // 
    const brandName = req.session.user.user.brandName;
    try {
        const seller = await Seller.findOne({brandName}); // Find the seller with the given brandName
        if (! seller) {
            return res.status(404).render('404page', {path: '/404'})
        }
        const products = await Product.find({seller: req.session.user.user._id}); // Find all products that belong to the seller
        res.render('sellerProducts', {
            products,
            path: '/seller/',
            pageTitle: 'Brand Page',
            brandName
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('404page', {path: '/404'})
    }
};


exports.getSellerDetailedProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id)
        const product = await Product.find({_id: String(id)})
        res.render("SellerDetailedProduct", {
            product: product[0],
            path: ""
        });
    
    } catch (error) {
        console.log(error.message);
    }
};

//order stuff
exports.sellerOrderList = async (req,res) => {
    const sellerId = req.session.user.user._id;
    const brandName = req.session.user.user.brandName;
    const seller = await Seller.findOne({brandName});
    let checkouts = await CheckOut.find({status: 'paid'}).populate({
        path: 'cartId',
        populate: {
            path: 'items.productId',
            model: 'Product',
            match: { seller: sellerId }, // add a condition to match the seller
        }
    })

    checkouts = checkouts.filter(item => {
        const allNull = item.cartId.items.every(item => item.productId === null);
        return !allNull;
      });
      
    console.log("checkouts")
    console.log(checkouts)
    res.render('sellerOrderList', {path:'/seller/orderList', checkouts,seller});
      

}

exports.postDeleteProduct = async (req, res, next) => { // get products of ONLY the current signed in seller
    const {id} = req.params;
    try {
        const isOwner = await Product.findOne({_id: String(id)});
        console.log(isOwner);
        if (!isOwner) {
            throw new Error('seller is not the owner of this product');
        }
        const product = await Product.findByIdAndDelete(String(id));
        console.log('Deleted product:', product);
        // const products = await Product.find({seller: req.session.user.user._id});
        res.redirect(req.get('referer'));
    } catch (error) {
        console.error('Error deleting product:', error);
        next(error);
    }
};

exports.editProductPost = async (req, res, next) => {
    try {
      const { prodId, ...updateFields } = req.body;
      const small = req.body.small;
      const medium = req.body.medium;
      const large = req.body.large;
  
      const availableSizes = [];
      if (small) {
        availableSizes.push(small);
      }
      if (medium) {
        availableSizes.push(medium);
      }
      if (large) {
        availableSizes.push(large);
      }
  
      const product = await Product.findByIdAndUpdate(
        prodId,
        { $set: { ...updateFields, availableSizes: availableSizes } },
        { new: true }
      );
  
      console.log(product);
      console.log(product.availableSizes);
      res.redirect('/seller/products/' + prodId);
    } catch (error) {
      console.log(error.message);
    }
  };


exports.postDeliveryDate =  async (req, res, next) => {
    const {id, date}= req.body;
    // find checkout that has and id from body 
    const checkout = await CheckOut.findByIdAndUpdate(id);
    // update delivery date
    checkout.deliveryDate = date;
    await checkout.save();
    res.redirect('/seller/orderList')
}


