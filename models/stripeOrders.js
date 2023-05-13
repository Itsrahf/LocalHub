const mongoose = require('mongoose');

// Define a schema for the orders collection
const orderSchema = new mongoose.Schema({
  orderId: String,
  customerId: String,
  timestamp: Date,
  totalAmount: Number,
  status: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  shippingAddress: {
    firstName: String,
    lastName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
});

// Create a model for the orders collection
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;