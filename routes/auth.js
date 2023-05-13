const { Router } = require('express');
const AuthController = require('../controller/AuthController');
const upload = require('../uploadImages');
const router = Router();

//buyer signup
router.get('/signup', AuthController.signup_get);
router.post('/signup', AuthController.signup_post);

//seller signup 
router.get('/seller/signup', AuthController.sellersSignup_get);
router.post('/seller/signup', upload.single('brandLogo'), AuthController.sellerSignup_post); //calling multer

//sign in for both 
router.get('/signin', AuthController.login_get);
router.post('/signin', AuthController.login_post);

router.get('/logout', AuthController.logout)


module.exports = router;