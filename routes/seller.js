const express = require("express");

const sellerController = require("../controller/SellerController");
const upload = require('../uploadImages')
const router = express.Router();

//gets index page for the seller (/seller)
router.get('/', sellerController.getOneSellerProducts);

router.get('/profile' , sellerController.getSellerProfile ) 
router.post('/profile/edit' , sellerController.postEditProfile ) 

//add product
router.get('/addproduct' , sellerController.getAddProduct);
router.post('/addproduct' , upload.fields([{name:'productimg1', maxCount:1}, {name:'productimg2', maxCount:1}, {name:'productimg3', maxCount:1}]), sellerController.postProduct)

//order list
router.get('/orderList' , sellerController.sellerOrderList)

//To get the product's details page
router.get('/products/:id', sellerController.getSellerDetailedProduct);
router.post('/sellerDetailedProduct', sellerController.editProductPost);

//delete product
router.get('/deleteProduct/:id', sellerController.postDeleteProduct);

// this gets one seller and their products FOR BRANDPAGE (that buyer sees)
router.get('/:brandName', sellerController.getSellerBrandPage);
// router.post('/:brandName', sellerController.getFilteredProducts);

router.post('/postDeliveryDate', sellerController.postDeliveryDate);



// Everything above this is finalized. Do not delete!!!!!!!!!!!!!!!

// most recurring error that we faced was that /seller/someroute and what would happen was that it would go to /seller/seller/somerou



module.exports = router; 
