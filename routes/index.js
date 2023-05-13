// index router
const Product = require("../models/product");
const sellerController = require("../controller/SellerController");
const indexController = require("../controller/IndexController");
const express = require("express");

const router = express.Router();

router.get('/', indexController.getIndex);

router.get('/profile', indexController.getProfile)
router.post('/profile/edit', indexController.postProfile)

// router.get("/signup", indexController.getSignUp) 

router.get("/shopping", indexController.getShopping)

//this should display brandpage for one brand
router.get("/shopping/:brandname", indexController.getShopBrandPage)

router.get("/prod/:prodId", indexController.getDetailedProduct)

// exporting the router to work
module.exports = router;