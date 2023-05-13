const mongoose = require("mongoose");
const { Schema } = mongoose;

const checkoutSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buyer",
    // required: true,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentLink: {
    type: String,
    // required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  deliveryDate: {
    // type is date in format YYYY-MM-DD
    type: Date,
  }
});

const Checkout = mongoose.model("Checkout", checkoutSchema);




module.exports = Checkout;
