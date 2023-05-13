const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  sellers: [{}],

});

const Notification = mongoose.model('Cart', notificationSchema)





module.exports = Cart
