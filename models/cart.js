const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      size: {
        type: String,
        enum: [
            'small', 'medium', 'large'
        ],
        required: true
      },
      img:{
        type: String,
        required: true
      }
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  }

});

const Cart = mongoose.model('Cart', cartSchema)





module.exports = Cart
