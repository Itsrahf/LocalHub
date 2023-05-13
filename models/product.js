const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // productID: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true
    // },
    productname: {
        type: String,
        required: true
    },
    productdesc: {
        type: String,
        required: true
    },
    sizeModel: {
        type: String,
        required: true
    },
    availableSizes: {
        type: [String],
        enum: [
            'small', 'medium', 'large'
        ],
        required: true
    },
    productprice: {
        type: Number,
        required: true
    },
    sizeGuide: {
        type: String,
        // required: true
    },
    careProcess: {
        type: String,
        required: true
    },
    productimg1: {
        type: String,
        required: true
    },
    productimg2: {
        type: String,
        // required: true
    },
    productimg3: {
        type: String,
        // required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seller' // reference to the Seller model
    }
    // categoryID: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Category'
    // }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
