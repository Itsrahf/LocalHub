const mongoose = require('mongoose');

// Define a schema for your data model
const sellerSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
        unique: true
    },
    brandDescription: {
        type: String,
        required: true
    },
    sellerEmail: {
        type: String,
        required: true,
        unique: true
    },
    brandLogo: {
        type: String,
        required: true
    },
    sellerPassword: {
        type: String,
        required: true
    },
    sellerPhone: {
        type: String,
        required: true,
        unique: true
    },
    maroofLicense: {
        type: String,
        required: true,
        unique: true,
        maxlength: 6
    },
    // social media account are not required
    instagram: {
        type: String
    },
    snapchat: {
        type: String
    },
    tiktok: {
        type: String
    },
    status: {
        type: String,
        enum: ['approved', 'pending'],
        default: 'approved',
    }
    // how to add the ProductID and OrderID
});




// Create a model from the schema
const Seller = mongoose.model('seller', sellerSchema);

// Export the model
module.exports = Seller;
